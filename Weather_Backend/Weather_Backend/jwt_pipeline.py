# jwt_pipeline.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.shortcuts import redirect

def create_jwt_token(strategy, details, user=None, *args, **kwargs):
    import logging
    logger = logging.getLogger(__name__)
    logger.info('create_jwt_token called')

    if user:
        # Generate JWT tokens using SimpleJWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Redirect the user to the Angular app with the tokens in the URL
        redirect_url = f"http://localhost:4200/oauth2/callback?token={access_token}&refresh_token={refresh_token}"
        return redirect(redirect_url)

