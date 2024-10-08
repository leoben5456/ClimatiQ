from django.apps import AppConfig


class WeatherConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Weather'

    def ready(self):
        import Weather.signals
