import os
from celery import shared_task
import requests
from dotenv import load_dotenv
from timezonefinder import TimezoneFinder
import pytz
from datetime import datetime
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from .models import UserPreference
import logging

# Setup logger
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()
api_key = os.getenv('WEATHER_API_KEY')
Weather_api_key = os.getenv('WEATHER_ALERTS_API_KEY')


# Function to fetch latitude and longitude of a city
def get_lat_lon(city_name):
    geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={api_key}"

    response = requests.get(geocode_url)
    response.raise_for_status()

    data = response.json()

    if data:
        # Extract latitude and longitude from the response
        lat = data[0]['lat']
        lon = data[0]['lon']
        return lat, lon
    else:
        raise ValueError("City not found")


# Function to fetch weather data for a given city
def get_weather_data(lat, lon):
    """Fetch weather data using latitude and longitude."""
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
    try:
        response = requests.get(weather_url)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Failed to fetch weather data: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error fetching weather data: {str(e)}")
        return None


# Function to get the timezone based on latitude and longitude
def get_timezone(lat, lon):
    """Fetch timezone using latitude and longitude."""
    tf = TimezoneFinder()
    timezone_str = tf.timezone_at(lng=lon, lat=lat)
    if timezone_str:
        return timezone_str  # E.g., "America/New_York"
    else:
        logger.error(f"Could not determine timezone for coordinates: {lat}, {lon}")
        return None


# Function to get current time in the user's local timezone
def get_user_local_time(user_timezone):
    # Get the current UTC time
    utc_now = datetime.utcnow().replace(tzinfo=pytz.utc)

    # Convert UTC time to the user's timezone
    user_tz = pytz.timezone(user_timezone)
    user_local_time = utc_now.astimezone(user_tz)

    return user_local_time


# Function to send weather email to a user
@shared_task
def send_weather_email(user_id):
    try:
        # Fetch the user's preferences
        preferences = UserPreference.objects.get(user_id=user_id)
        user = preferences.user

        # Check if notifications are enabled and user has a location
        if preferences.notification and user.location:
            lat, lon = get_lat_lon(user.location)

            if lat and lon:
                # Get timezone from latitude and longitude
                user_timezone = get_timezone(lat, lon)

                if user_timezone:
                    # Save the timezone to the user's preferences if needed
                    preferences.timezone = user_timezone
                    preferences.save()

                    weather_data = get_weather_data(lat, lon)
                    if weather_data and 'weather' in weather_data:
                        # Create weather report based on fetched data
                        weather_condition = weather_data['weather'][0]['description']
                        temperature = round(weather_data['main']['temp'] - 273.15, 2)
                        city = user.location

                        # Ensure user email is available
                        if user.email:
                            # Render the HTML template with the user's data
                            html_content = render_to_string('DailyWeather.html', {
                                'name': user.first_name,
                                'city': city,
                                'weather_condition': weather_condition,
                                'temperature': temperature,
                                'forecast_link': 'https://example.com/full-forecast'  # Replace with real link
                            })

                            # Create an email with both plain text and HTML content
                            subject = 'Your Daily Weather Update'
                            from_email = 'from@example.com'
                            to_email = [user.email]
                            text_content = f"Today's weather in {city}: {weather_condition}, temperature: {temperature}°C."

                            # Send the email
                            msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
                            msg.attach_alternative(html_content, "text/html")
                            msg.send()

                        else:
                            logger.error(f"No email found for user ID: {user_id}")
                    else:
                        logger.error(f"Weather data is missing or incomplete for user ID: {user_id}")
                else:
                    logger.error(f"Could not fetch timezone for user ID: {user_id}")
            else:
                logger.error(f"Could not fetch latitude and longitude for user ID: {user_id}")

    except UserPreference.DoesNotExist:
        logger.error(f"No preferences found for user ID: {user_id}")
    except Exception as e:
        logger.error(f"Error sending email to user ID {user_id}: {str(e)}")


# Task to send weather emails in the morning based on user's local time
@shared_task
def send_weather_emails_to_all_users():
    # Filter users who have enabled notifications
    user_preferences = UserPreference.objects.filter(notification=True)

    # Loop through users and check if it's morning (e.g., 7 AM) in their timezone
    for preference in user_preferences:
        if preference.timezone:
            # Get the user's local time
            user_local_time = get_user_local_time(preference.timezone)

            # Log the user's local time for debugging
            logger.info(f"User ID {preference.user_id} local time: {user_local_time}")

            # Check if it's 6 AM in the user's local time
            if user_local_time.hour == 6 and user_local_time.minute == 00:
                logger.info(f"Sending email to user ID {preference.user_id}")
                # Send email to the user
                send_weather_email.delay(preference.user_id)
        else:
            logger.error(f"Timezone is not set for user ID: {preference.user_id}")


# Function to fetch weather alerts
def get_weather_alerts(lat, lon):
    weather_alert_api = f"https://api.weatherbit.io/v2.0/alerts?lat={lat}&lon={lon}&key={Weather_api_key}"
    try:
        response = requests.get(weather_alert_api)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Failed to fetch weather alerts: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error fetching weather alerts: {str(e)}")
        return None


# Task to check and send weather alerts to all users
@shared_task
def send_weather_alerts_to_all_users():
    # Fetch users who have notifications enabled
    user_preferences = UserPreference.objects.filter(notification=True)

    for preference in user_preferences:
        user = preference.user

        if user.location:
            try:
                lat, lon = get_lat_lon(user.location)

                if lat and lon:
                    # Fetch weather alerts for the user's location
                    weather_alerts = get_weather_alerts(lat, lon)

                    if weather_alerts and 'alerts' in weather_alerts and weather_alerts['alerts']:
                        # Prepare email content for alerts
                        for alert in weather_alerts['alerts']:
                            if user.email:
                                # Render the email content
                                html_content = render_to_string('WeatherAlert.html', {
                                    'name': user.first_name,
                                    'city': user.location,
                                    'alert_title': alert['title'],
                                    'alert_description': alert['description'],
                                    'alert_instructions': alert.get('instruction', 'Follow local authorities')
                                })

                                # Send email with weather alert
                                subject = f"Weather Alert: {alert['title']}"
                                from_email = 'from@example.com'
                                to_email = [user.email]
                                text_content = f"Weather Alert for {user.location}: {alert['title']}\n\n{alert['description']}\n\nInstructions: {alert.get('instruction', 'Follow local authorities')}"

                                msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
                                msg.attach_alternative(html_content, "text/html")
                                msg.send()
                                logger.info(f"Sent weather alert to {user.email}")

            except Exception as e:
                logger.error(f"Error fetching alerts or sending email to user {user.id}: {str(e)}")
