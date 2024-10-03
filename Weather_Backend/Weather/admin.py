from django.contrib import admin
from .models import User, UserPreference, City

admin.site.register(User)
admin.site.register(UserPreference)
admin.site.register(City)