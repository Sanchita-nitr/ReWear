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
    path("send-otp/", SendOTPView.as_view(), name="send-otp"), # Send OTP to the user for registration
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"), # Send and verify OTP for user registration
    path("register/", UserRegisterView.as_view(), name="user-register"), # Register a new user
    path("me/", UserProfileView.as_view(), name="user-profile"), # Retrieve and update the authenticated user's profile
    path("users/", UserListView.as_view(), name="user-list"), # List all users (admin only)
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"), # Obtain JWT token pair for user authentication
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), # Refresh JWT token
]
