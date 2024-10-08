# Generated by Django 5.0.3 on 2024-03-24 21:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Weather', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPreference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('temperature', models.CharField(choices=[('C', 'Celsius'), ('F', 'Fahrenheit')], default='C', max_length=1)),
                ('windSpeed', models.CharField(choices=[('Km/h', 'Kilometers per hour'), ('M/h', 'Meters per hour')], default='Km/h', max_length=5)),
                ('pressure', models.CharField(choices=[('Pa', 'Pascal'), ('atm', 'Atmosphere'), ('bar', 'Bar'), ('psi', 'Pound per square inch')], default='Pa', max_length=3)),
                ('distance', models.CharField(choices=[('Km', 'kilometers'), ('M', 'Meters')], default='Km', max_length=2)),
                ('notification', models.BooleanField(default=False)),
                ('hourTime', models.BooleanField(default=False)),
                ('location', models.BooleanField(default=False)),
                ('darkMode', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='preference',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_preference', to='Weather.userpreference'),
        ),
    ]
