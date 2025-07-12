from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    SendOTPView,
    VerifyOTPView,
    UserRegisterView,
    UserProfileView,
    UserListView,
)

urlpatterns = [
    path("auth/send-otp/", SendOTPView.as_view(), name="send-otp"), # Send OTP to the user for registration
    path("auth/verify-otp/", VerifyOTPView.as_view(), name="verify-otp"), # Send and verify OTP for user registration
    path("auth/register/", UserRegisterView.as_view(), name="user-register"), # Register a new user
    path("auth/me/", UserProfileView.as_view(), name="user-profile"), # Retrieve and update the authenticated user's profile
    path("auth/users/", UserListView.as_view(), name="user-list"), # List all users (admin only)

    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"), # Obtain JWT token pair for user authentication
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), # Refresh JWT token
]
