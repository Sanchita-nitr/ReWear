from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ItemImageViewSet, LikedItemsList

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'item-images', ItemImageViewSet, basename='itemimage')

urlpatterns = [
    path('', include(router.urls)),
    path('like/', LikedItemsList.as_view(), name='liked-items'),
]
