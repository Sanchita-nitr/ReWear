from rest_framework import viewsets, permissions, parsers, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Item, ItemImage, Like
from .serializers import ItemSerializer, ItemImageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.uploaded_by == request.user

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'tags__name']
    ordering_fields = ['created_at', 'updated_at']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        item = get_object_or_404(Item, pk=pk)
        user = request.user
        like, created = Like.objects.get_or_create(user=user, item=item)
        if not created:
            like.delete()
            return Response({"status": "unliked"}, status=status.HTTP_200_OK)
        return Response({"status": "liked"}, status=status.HTTP_201_CREATED)

class ItemImageViewSet(viewsets.ModelViewSet):
    queryset = ItemImage.objects.all()
    serializer_class = ItemImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        item_id = self.request.data.get('item')
        serializer.save(item_id=item_id)

class LikedItemsList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        liked_items = Item.objects.filter(likes__user=request.user)
        serializer = ItemSerializer(liked_items, many=True)
        return Response(serializer.data)

class UserProductStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        total_created = Item.objects.filter(uploaded_by=user).count()
        total_sold = Item.objects.filter(uploaded_by=user, status__in=['swapped', 'redeemed']).count()
        return Response({
            'total_products_created': total_created,
            'total_products_sold': total_sold,
        })
