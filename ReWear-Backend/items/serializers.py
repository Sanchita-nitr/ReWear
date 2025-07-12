from rest_framework import serializers
from .models import Item, ItemImage

class ItemImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model  = ItemImage
        fields = ('id', 'image')

class ItemSerializer(serializers.ModelSerializer):
    images      = ItemImageSerializer(many=True, read_only=True)
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = Item
        fields = [
            'id', 'title', 'description', 'category', 'size', 'type',
            'condition', 'availability', 'status', 'uploaded_by',
            'images', 'tags', 'created_at', 'updated_at'
        ]
        read_only_fields = ('status', 'uploaded_by', 'created_at', 'updated_at')

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        item = Item.objects.create(**validated_data)
        item.tags.set(tags)
        return item