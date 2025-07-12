from rest_framework import serializers
from .models import Item, ItemImage


class ItemImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'uploaded_at']


class ItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = Item
        fields = [
            'id', 'title', 'description', 'points', 'negotiable',
            'category', 'gender', 'size', 'condition', 'occasion', 'season',
            'availability', 'status', 'uploaded_by',
            'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'uploaded_by', 'created_at', 'updated_at']


    def create(self, validated_data):
        item = Item.objects.create(**validated_data)
        return item

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tag_names', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_names is not None:
            instance.tags.set(*tag_names)
        return instance
