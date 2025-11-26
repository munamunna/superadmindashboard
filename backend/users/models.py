from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

from django.conf import settings

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_super_admin', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_super_admin') is not True:
            raise ValueError('Superuser must have is_super_admin=True.')

        return self.create_user(email, username, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_super_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()  # <-- add the custom manager

    def __str__(self):
        return self.email




class PagePermission(models.Model):
    PAGE_CHOICES = [
        ('products', 'Products List'),
        ('marketing', 'Marketing List'),
        ('orders', 'Order List'),
        ('media', 'Media Plans'),
        ('offers', 'Offer Pricing SKUs'),
        ('clients', 'Clients'),
        ('suppliers', 'Suppliers'),
        ('support', 'Customer Support'),
        ('sales', 'Sales Reports'),
        ('finance', 'Finance & Accounting'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="permissions")
    page_name = models.CharField(max_length=50, choices=PAGE_CHOICES)

    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'page_name')

    def __str__(self):
        return f"{self.user.email} - {self.page_name}"


class Comment(models.Model):
    PAGE_CHOICES = [
        ('products', 'Products List'),
        ('marketing', 'Marketing List'),
        ('orders', 'Order List'),
        ('media', 'Media Plans'),
        ('offers', 'Offer Pricing SKUs'),
        ('clients', 'Clients'),
        ('suppliers', 'Suppliers'),
        ('support', 'Customer Support'),
        ('sales', 'Sales Reports'),
        ('finance', 'Finance & Accounting'),
    ]

    page_name = models.CharField(max_length=50, choices=PAGE_CHOICES)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']  # Newest first

    def __str__(self):
        return f"{self.user.username} on {self.page_name}: {self.text[:50]}"

