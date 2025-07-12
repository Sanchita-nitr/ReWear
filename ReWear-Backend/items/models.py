from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField

CATEGORIES = [
    ('Tops', 'Tops'),
    ('Bottoms', 'Bottoms'),
    ('Ethnic Wear', 'Ethnic Wear'),
    ('Dresses & One-Pieces', 'Dresses & One-Pieces'),
    ('Outerwear', 'Outerwear'),
    ('Activewear', 'Activewear'),
    ('Footwear', 'Footwear'),
    ('Accessories', 'Accessories'),
    ('Winter Wear', 'Winter Wear'),
    ('Unisex/Free Size', 'Unisex/Free Size'),
    ('Others', 'Others'),
]

GENDER_CHOICES = [
    ('Men', 'Men'),
    ('Women', 'Women'),
    ('Unisex', 'Unisex'),
]

SIZE_CHOICES = [
    ('XS', 'XS'),
    ('S', 'S'),
    ('M', 'M'),
    ('L', 'L'),
    ('XL', 'XL'),
    ('XXL', 'XXL'),
    ('Free Size', 'Free Size'),
]

CONDITION_CHOICES = [
    ('New', 'New'),
    ('Like New', 'Like New'),
    ('Gently Used', 'Gently Used'),
    ('Fair', 'Fair'),
]

OCCASION_CHOICES = [
    ('Casual', 'Casual'),
    ('Formal', 'Formal'),
    ('Festive', 'Festive'),
    ('Partywear', 'Partywear'),
    ('Others', 'Others'),
]

SEASON_CHOICES = [
    ('Summer', 'Summer'),
    ('Winter', 'Winter'),
    ('All-Season', 'All-Season'),
]

# Status for swap/redeem
STATUS_CHOICES = [
    ('available', 'Available'),
    ('swapped',   'Swapped'),
    ('redeemed',  'Redeemed'),
]

class Item(models.Model):
    title        = models.CharField(max_length=200)
    description  = models.TextField(blank=True)
    points       = models.PositiveIntegerField()
    negotiable   = models.BooleanField(default=False)

    category     = models.CharField(max_length=50, choices=CATEGORIES, default='Others')
    gender       = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Unisex')
    size         = models.CharField(max_length=20, choices=SIZE_CHOICES, default='Free Size')
    condition    = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='Gently Used')
    occasion     = models.CharField(max_length=20, choices=OCCASION_CHOICES, default='Casual')
    season       = models.CharField(max_length=20, choices=SEASON_CHOICES, default='All-Season')

    availability = models.BooleanField(default=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    uploaded_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='items'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class ItemImage(models.Model):
    item        = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='images')
    image       = CloudinaryField('image', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.item.title}"
