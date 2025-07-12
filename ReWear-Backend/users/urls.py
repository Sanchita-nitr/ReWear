from django.urls import path
from .views import (
    SendOTPView,
    VerifyOTPView,
    UserRegisterView,
    UserProfileView,
    UserListView,
)

urlpatterns = [
    path('auth/send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/register/', UserRegisterView.as_view(), name='user-register'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/users/', UserListView.as_view(), name='user-list'),
]