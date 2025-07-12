from django.contrib import admin
from .models import Item, ItemImage

class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 1

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_by', 'status', 'availability', 'created_at')
    search_fields = ('title', 'description', 'category')
    list_filter = ('status', 'availability', 'created_at')
    inlines = [ItemImageInline]

@admin.register(ItemImage)
class ItemImageAdmin(admin.ModelAdmin):
    list_display = ('item', 'image', 'uploaded_at')