from django.db import models
from django.contrib.auth.models import AbstractUser
from pygments.lexer import default
from timezone_field import TimeZoneField


class User(AbstractUser):
    location = models.CharField(max_length=255, null=True)
    City=models.CharField(max_length=255, null=True)
    preference = models.OneToOneField('UserPreference', on_delete=models.CASCADE, related_name='user_preference',
                                      null=True)




class City(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    users = models.ManyToManyField(User, related_name='cities', blank=True)

    def __str__(self):
        return self.name


class UserPreference(models.Model):
    temperature_Units = [
        ("C", "Celsius"),
        ("F", "Fahrenheit"),
    ]

    windSpeed_Units = [
        ("Km/h", "Kilometers per hour"),
        ("M/h", "Meters per hour"),
    ]

    SEA_LEVEL_UNITS = [
        ('hPa', 'Hectopascals'),
        ('mmHg', 'Millimeters of Mercury'),
        ('inHg', 'Inches of Mercury'),
    ]


    HUMIDITY_UNITS = [
        ('%', 'Percentage'),
        ('g/m³', 'Grams per cubic meter'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    temperature = models.CharField(max_length=1, choices=temperature_Units, default="C")
    windSpeed = models.CharField(max_length=5, choices=windSpeed_Units, default="Km/h")
    seaLevel = models.CharField(max_length=10, default='hPa')
    humidity = models.CharField(max_length=10, default='%')
    notification = models.BooleanField(default=False)
    hourTime = models.BooleanField(default=False)
    location = models.BooleanField(default=False)
    darkMode = models.BooleanField(default=False)
    timezone = models.CharField(max_length=50, blank=True, null=True)
