from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Swap(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='swap_requests_sent',
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='swap_requests_received',
        on_delete=models.CASCADE
    )
    requester_item = models.ForeignKey(
        'items.Item',
        related_name='swap_offers_made',
        on_delete=models.CASCADE
    )
    owner_item = models.ForeignKey(
        'items.Item',
        related_name='swap_offers_received',
        on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    message = models.TextField(blank=True, help_text="Optional message from requester")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['requester_item', 'owner_item', 'status']

    def clean(self):
        # Prevent self-swapping
        if self.requester == self.owner:
            raise ValidationError("Cannot swap with yourself")

        # Check if requester owns the item they're offering
        if self.requester_item.uploaded_by != self.requester:
            raise ValidationError("You can only offer your own items")

        # Check if both items are available
        if not self.requester_item.availability or not self.owner_item.availability:
            raise ValidationError("One or both items are not available")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Swap {self.id}: {self.requester.email} <-> {self.owner.email} [{self.status}]"


class SwapMessage(models.Model):
    """Simple messaging system for swaps"""
    swap = models.ForeignKey(Swap, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender.email} in Swap {self.swap.id}"