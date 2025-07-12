from django.db import models
from django.conf import settings
from taggit.managers import TaggableManager

class Item(models.Model):
    AVAILABLE = 'available'
    SWAPPED = 'swapped'
    REDEEMED= 'redeemed'
    STATUS_CHOICES = [
        (AVAILABLE, 'Available'),
        (SWAPPED,   'Swapped'),
        (REDEEMED,  'Redeemed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category= models.CharField(max_length=100)
    size = models.CharField(max_length=50, blank=True)
    type = models.CharField(max_length=100, blank=True)
    condition= models.CharField(max_length=100)
    availability= models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=AVAILABLE)
    uploaded_by= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    tags = TaggableManager(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='images')
    image= models.ImageField(upload_to='items/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.item.title}"