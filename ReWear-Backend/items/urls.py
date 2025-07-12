from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, ItemImageViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'item-images', ItemImageViewSet, basename='itemimage')

urlpatterns = router.urls