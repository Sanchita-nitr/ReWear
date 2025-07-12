from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SwapViewSet

router = DefaultRouter()
router.register(r'swaps', SwapViewSet, basename='swap')

urlpatterns = [
    path('', include(router.urls)),
]

# Available endpoints:
# GET    //swaps/                    - List all swaps for user
# POST   //swaps/                    - Create new swap request
# GET    //swaps/{id}/               - Get swap details
# PUT    //swaps/{id}/               - Update swap (limited)
# DELETE //swaps/{id}/               - Delete swap (limited)
# POST   //swaps/{id}/accept/        - Accept swap request
# POST   //swaps/{id}/reject/        - Reject swap request
# POST   //swaps/{id}/cancel/        - Cancel swap request
# POST   //swaps/{id}/complete/      - Complete swap
# GET    //swaps/{id}/messages/      - Get swap messages
# POST   //swaps/{id}/messages/      - Send message in swap
# GET    //swaps/my_requests/        - Get user's sent requests
# GET    //swaps/received_requests/  - Get user's received requests
# GET    //swaps/pending/            - Get all pending swaps