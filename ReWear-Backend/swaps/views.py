from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Q
from .models import Swap, SwapMessage
from .serializers import (
    SwapCreateSerializer, SwapListSerializer,
    SwapDetailSerializer, SwapMessageSerializer
)


class SwapViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Swap.objects.filter(
            Q(requester=user) | Q(owner=user)
        ).select_related('requester', 'owner', 'requester_item', 'owner_item')

    def get_serializer_class(self):
        if self.action == 'create':
            return SwapCreateSerializer
        elif self.action == 'list':
            return SwapListSerializer
        else:
            return SwapDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        swap = serializer.save()

        # Return detailed response
        response_serializer = SwapDetailSerializer(swap, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        swap = self.get_object()

        # Check permissions
        if request.user != swap.owner:
            return Response(
                {'error': 'Only the item owner can accept this swap'},
                status=status.HTTP_403_FORBIDDEN
            )

        if swap.status != 'pending':
            return Response(
                {'error': 'Can only accept pending swaps'},
                status=status.HTTP_400_BAD_REQUEST
            )

        swap.status = 'accepted'
        swap.save()

        serializer = SwapDetailSerializer(swap, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        swap = self.get_object()

        # Check permissions
        if request.user != swap.owner:
            return Response(
                {'error': 'Only the item owner can reject this swap'},
                status=status.HTTP_403_FORBIDDEN
            )

        if swap.status != 'pending':
            return Response(
                {'error': 'Can only reject pending swaps'},
                status=status.HTTP_400_BAD_REQUEST
            )

        self._unlock_items(swap)
        swap.status = 'rejected'
        swap.save()

        serializer = SwapDetailSerializer(swap, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        swap = self.get_object()

        # Check permissions
        if request.user != swap.requester:
            return Response(
                {'error': 'Only the requester can cancel this swap'},
                status=status.HTTP_403_FORBIDDEN
            )

        if swap.status != 'pending':
            return Response(
                {'error': 'Can only cancel pending swaps'},
                status=status.HTTP_400_BAD_REQUEST
            )

        self._unlock_items(swap)
        swap.status = 'cancelled'
        swap.save()

        serializer = SwapDetailSerializer(swap, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def complete(self, request, pk=None):
        swap = self.get_object()

        # Check permissions
        if request.user != swap.requester:
            return Response(
                {'error': 'Only the requester can complete this swap'},
                status=status.HTTP_403_FORBIDDEN
            )

        if swap.status != 'accepted':
            return Response(
                {'error': 'Can only complete accepted swaps'},
                status=status.HTTP_400_BAD_REQUEST
            )

        requester = swap.requester
        owner = swap.owner
        points_needed = swap.owner_item.points

        # Final point check
        if requester.points < points_needed:
            return Response(
                {'error': f'Insufficient points. Need {points_needed}, have {requester.points}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Transfer points
        requester.points -= points_needed
        owner.points += points_needed
        requester.save()
        owner.save()

        # Update item status
        swap.requester_item.status = 'swapped'
        swap.owner_item.status = 'swapped'
        swap.requester_item.save()
        swap.owner_item.save()

        # Complete swap
        swap.status = 'completed'
        swap.save()

        serializer = SwapDetailSerializer(swap, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        swap = self.get_object()

        if request.method == 'GET':
            messages = swap.messages.all()
            serializer = SwapMessageSerializer(messages, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            # Check if user is part of this swap
            if request.user not in [swap.requester, swap.owner]:
                return Response(
                    {'error': 'You are not part of this swap'},
                    status=status.HTTP_403_FORBIDDEN
                )

            serializer = SwapMessageSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(swap=swap)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Get swaps where current user is the requester"""
        swaps = self.get_queryset().filter(requester=request.user)
        serializer = SwapListSerializer(swaps, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def received_requests(self, request):
        """Get swaps where current user is the owner"""
        swaps = self.get_queryset().filter(owner=request.user)
        serializer = SwapListSerializer(swaps, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending swaps for current user"""
        swaps = self.get_queryset().filter(status='pending')
        serializer = SwapListSerializer(swaps, many=True)
        return Response(serializer.data)

    def _unlock_items(self, swap):
        """Helper method to unlock items when swap is cancelled/rejected"""
        swap.requester_item.availability = True
        swap.owner_item.availability = True
        swap.requester_item.save()
        swap.owner_item.save()