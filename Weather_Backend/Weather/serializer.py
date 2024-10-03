from rest_framework import serializers
from .models import User, UserPreference, City


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'location','City']


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = "__all__"


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['name', 'latitude', 'longitude', 'users']

    def create(self, validated_data):
        # Remove users from validated_data since we'll handle that manually
        users = validated_data.pop('users', None)

        # Create the city
        city = City.objects.create(**validated_data)

        # Handle the users field manually
        if users:
            for user in users:
                city.users.add(user)

        return city

