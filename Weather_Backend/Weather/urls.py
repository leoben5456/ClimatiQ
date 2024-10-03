from django.urls import path, re_path
from rest_framework import permissions

from . import views
from .views import get_user_preference, update_user_preference, get_user_info, update_user_info, get_user_cities, \
    user_registration, add_city
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, include

schema_view = get_schema_view(
    openapi.Info(
        title="Weather API",
        default_version='v1',
        description="API documentation for the Weather project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@weather.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)



urlpatterns = [
    path('user/preferences', view=get_user_preference, name='get_user_preference'),
    path('update/user/preferences', view=update_user_preference, name='update_user_preference'),
    path('user/info/', view=get_user_info, name='get_user_info'),
    path('update/user/info/', view=update_user_info, name='update_user_info'),
    path('user/cities', view=get_user_cities, name='get_user_cities'),
    path('user/registration/', view=user_registration, name='user_registration'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('add/city/', view=add_city, name='add_city'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('swagger.yaml/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('weather-email-preview/', views.weather_email_preview, name='weather_email_preview'),


]
