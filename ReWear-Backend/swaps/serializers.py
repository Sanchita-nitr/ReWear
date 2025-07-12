from rest_framework import serializers
from django.db import transaction
from .models import Swap, SwapMessage


class SwapCreateSerializer(serializers.ModelSerializer):
    message = serializers.CharField(max_length=500, required=False, allow_blank=True)

    class Meta:
        model = Swap
        fields = ['requester_item', 'owner_item', 'message']

    def validate(self, data):
        requester_item = data['requester_item']
        owner_item = data['owner_item']
        requester = self.context['request'].user

        # Check if requester owns the item they're offering
        if requester_item.uploaded_by != requester:
            raise serializers.ValidationError("You can only offer your own items")

        # Check if trying to swap with self
        if requester == owner_item.uploaded_by:
            raise serializers.ValidationError("Cannot swap with yourself")

        # Check if both items are available
        if not requester_item.availability:
            raise serializers.ValidationError("Your item is not available")
        if not owner_item.availability:
            raise serializers.ValidationError("The requested item is not available")

        # Check if requester has enough points
        if requester.points < owner_item.points:
            raise serializers.ValidationError(
                f"Insufficient points. You need {owner_item.points} points but have {requester.points}"
            )

        # Check for existing pending swap
        existing_swap = Swap.objects.filter(
            requester_item=requester_item,
            owner_item=owner_item,
            status='pending'
        ).exists()
        if existing_swap:
            raise serializers.ValidationError("A pending swap already exists for these items")

        return data

    @transaction.atomic
    def create(self, validated_data):
        requester = self.context['request'].user
        owner_item = validated_data['owner_item']
        owner = owner_item.uploaded_by
        message_text = validated_data.pop('message', '')

        # Lock both items
        validated_data['requester_item'].availability = False
        validated_data['owner_item'].availability = False
        validated_data['requester_item'].save()
        validated_data['owner_item'].save()

        # Create swap
        swap = Swap.objects.create(
            requester=requester,
            owner=owner,
            **validated_data
        )

        # Add initial message if provided
        if message_text:
            SwapMessage.objects.create(
                swap=swap,
                sender=requester,
                message=message_text
            )

        return swap


class SwapListSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.first_name', read_only=True)
    owner_name = serializers.CharField(source='owner.first_name', read_only=True)
    requester_item_title = serializers.CharField(source='requester_item.title', read_only=True)
    owner_item_title = serializers.CharField(source='owner_item.title', read_only=True)
    requester_item_image = serializers.SerializerMethodField()
    owner_item_image = serializers.SerializerMethodField()

    class Meta:
        model = Swap
        fields = [
            'id', 'status', 'created_at', 'updated_at',
            'requester_name', 'owner_name',
            'requester_item_title', 'owner_item_title',
            'requester_item_image', 'owner_item_image'
        ]

    def get_requester_item_image(self, obj):
        if obj.requester_item.images.exists():
            return obj.requester_item.images.first().image.url
        return None

    def get_owner_item_image(self, obj):
        if obj.owner_item.images.exists():
            return obj.owner_item.images.first().image.url
        return None


class SwapDetailSerializer(serializers.ModelSerializer):
    requester_details = serializers.SerializerMethodField()
    owner_details = serializers.SerializerMethodField()
    requester_item_details = serializers.SerializerMethodField()
    owner_item_details = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()
    can_accept = serializers.SerializerMethodField()
    can_reject = serializers.SerializerMethodField()
    can_cancel = serializers.SerializerMethodField()
    can_complete = serializers.SerializerMethodField()

    class Meta:
        model = Swap
        fields = [
            'id', 'status', 'created_at', 'updated_at',
            'requester_details', 'owner_details',
            'requester_item_details', 'owner_item_details',
            'messages', 'can_accept', 'can_reject', 'can_cancel', 'can_complete'
        ]

    def get_requester_details(self, obj):
        return {
            'id': obj.requester.id,
            'name': f"{obj.requester.first_name} {obj.requester.last_name}",
            'email': obj.requester.email,
            'points': obj.requester.points
        }

    def get_owner_details(self, obj):
        return {
            'id': obj.owner.id,
            'name': f"{obj.owner.first_name} {obj.owner.last_name}",
            'email': obj.owner.email,
            'points': obj.owner.points
        }

    def get_requester_item_details(self, obj):
        item = obj.requester_item
        return {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'points': item.points,
            'category': item.category,
            'condition': item.condition,
            'images': [img.image.url for img in item.images.all()]
        }

    def get_owner_item_details(self, obj):
        item = obj.owner_item
        return {
            'id': item.id,
            'title': item.title,
            'description': item.description,
            'points': item.points,
            'category': item.category,
            'condition': item.condition,
            'images': [img.image.url for img in item.images.all()]
        }

    def get_messages(self, obj):
        return [{
            'id': msg.id,
            'sender': msg.sender.first_name,
            'message': msg.message,
            'created_at': msg.created_at
        } for msg in obj.messages.all()]

    def get_can_accept(self, obj):
        user = self.context['request'].user
        return user == obj.owner and obj.status == 'pending'

    def get_can_reject(self, obj):
        user = self.context['request'].user
        return user == obj.owner and obj.status == 'pending'

    def get_can_cancel(self, obj):
        user = self.context['request'].user
        return user == obj.requester and obj.status == 'pending'

    def get_can_complete(self, obj):
        user = self.context['request'].user
        return user == obj.requester and obj.status == 'accepted'


class SwapMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.first_name', read_only=True)

    class Meta:
        model = SwapMessage
        fields = ['id', 'message', 'sender_name', 'created_at']
        read_only_fields = ['sender_name', 'created_at']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)