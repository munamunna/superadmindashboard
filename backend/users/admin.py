
from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'date_joined')  # columns in list view
    search_fields = ('username', 'email')                                  # adds search box
    list_filter = ('is_staff', 'is_active')                                # filters on the right side


# Register your models here.
