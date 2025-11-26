from django.contrib import admin
from .models import User, PagePermission, PasswordResetToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'date_joined')  # columns in list view
    search_fields = ('username', 'email')                                  # adds search box
    list_filter = ('is_staff', 'is_active')                                # filters on the right side


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at', 'used')
    list_filter = ('used', 'created_at')
    search_fields = ('user__email', 'token')
    readonly_fields = ('token', 'created_at', 'expires_at')


# Register your models here.
admin.site.register(PagePermission)