from functools import partial

from django.core.exceptions import ObjectDoesNotExist
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User, UserPreference, City
from .serializer import UserSerializer, UserPreferenceSerializer, CitySerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_preference(request):
    print(f"Username: {request.user}")
    if request.user.is_authenticated:
        try:
            user = User.objects.get(username=request.user)
            user_preference = UserPreference.objects.get(user=user)
            serializer = UserPreferenceSerializer(user_preference)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response({"error": "User does not exist"}, status=404)
    else:
        return Response({"error": "User is not authenticated"}, status=401)


@api_view(['PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user_preference(request):
    user = User.objects.get(username=request.user)
    user_preference = UserPreference.objects.get(user=user)
    serializer = UserPreferenceSerializer(user_preference, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = User.objects.get(username=request.user)
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user_info(request):
    user = User.objects.get(username=request.user)
    serializer = UserSerializer(user, data=request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_cities(request):
    user = User.objects.get(username=request.user)
    print("user is :" + str(user))
    cities = user.cities.all()
    serializer = CitySerializer(cities, many=True)
    print(serializer.data)
    return Response(serializer.data)


@swagger_auto_schema(
    method='post',
    request_body=CitySerializer,
    responses={
        201: openapi.Response('City created', CitySerializer),
        400: 'Bad Request'
    }
)
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_city(request):
    user = request.user

    # Check if the user already has 4 cities
    if user.cities.count() >= 4:
        return Response(
            {"error": "You have reached the maximum number of cities allowed (4)."},
            status=status.HTTP_400_BAD_REQUEST
        )

    city_name = request.data.get('city_name')
    if not city_name:
        return Response(
            {"error": "City name is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if the city already exists in the database
    city = City.objects.filter(name=city_name).first()

    if city:
        # Check if the city is already associated with the user
        if city.users.filter(id=user.id).exists():
            return Response(
                {"error": "You have already added this city."},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            # Associate the existing city with the user
            city.users.add(user)
            return Response(
                CitySerializer(city).data,
                status=status.HTTP_201_CREATED
            )
    else:
        # Create a new city and associate it with the user
        data = {'name': city_name}
        serializer = CitySerializer(data=data)

        if serializer.is_valid():
            city = serializer.save()
            city.users.add(user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )




@swagger_auto_schema(
    method='post',
    request_body=UserSerializer,
    responses={
        201: openapi.Response('User created', UserSerializer),
        400: 'Bad Request'
    }

)
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_registration(request):
    username = request.data.get('username')
    if user_exists(username):
        return Response({"error": "User already exists"}, status=400)
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


def user_exists(username):
    return User.objects.filter(username=username).exists()


def city_exists(city_name):
    return City.objects.filter(name=city_name).exists()


def weather_email_preview(request):
    context = {
        'name':'John Doe',
        'city': 'Rabat',
        'temperature': '25°C',
        'weather_condition': 'Scattered Clouds',
    }
    return render(request, 'DailyWeather.html', context)



