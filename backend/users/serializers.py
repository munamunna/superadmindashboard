from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

from django.contrib.auth.hashers import make_password
import secrets, string
from .models import PagePermission, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_super_admin']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user




class UserCreateSerializer(serializers.ModelSerializer):
    auto_password = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_super_admin', 'auto_password']

    def create(self, validated_data):
        import secrets, string
        from django.contrib.auth.hashers import make_password

        alphabet = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(secrets.choice(alphabet) for _ in range(10))
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            is_super_admin=validated_data.get('is_super_admin', False),
            password=make_password(password)
        )
        # temporarily store the password in serializer instance
        self._auto_password = password
        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # add the generated password if available
        if hasattr(self, '_auto_password'):
            data['auto_password'] = self._auto_password
        return data


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_super_admin']




class PagePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagePermission
        fields = ['id', 'page_name', 'can_view', 'can_create', 'can_edit', 'can_delete']

class UserPermissionSerializer(serializers.ModelSerializer):
    permissions = PagePermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_super_admin', 'permissions']


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'page_name', 'user', 'username', 'user_email', 'text', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

