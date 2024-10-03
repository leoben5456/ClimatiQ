from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, UserPreference


@receiver(post_save, sender=User)
def create_user_preference(sender, instance, created, **kwargs):
    if created:
        user_preference = UserPreference.objects.create(user=instance)
        instance.preference = user_preference
        instance.save()


@receiver(post_save, sender=User)
def save_user_preference(sender, instance, **kwargs):
    instance.userpreference.save()
