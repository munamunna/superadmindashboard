from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer

from rest_framework import generics, permissions
from .serializers import UserCreateSerializer, UserListSerializer, CommentSerializer
from .models import PagePermission, User, Comment
from .serializers import PagePermissionSerializer, UserPermissionSerializer
from rest_framework.permissions import IsAuthenticated

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }
        return Response(data, status=status.HTTP_200_OK)



class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_super_admin)

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [IsSuperAdmin]

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsSuperAdmin]



class PermissionViewSet(viewsets.ModelViewSet):
    queryset = PagePermission.objects.all()
    serializer_class = PagePermissionSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        page_name = request.data.get('page_name')

        permission, created = PagePermission.objects.update_or_create(
            user_id=user_id, page_name=page_name,
            defaults={
                'can_view': request.data.get('can_view', False),
                'can_create': request.data.get('can_create', False),
                'can_edit': request.data.get('can_edit', False),
                'can_delete': request.data.get('can_delete', False)
            }
        )
        return Response(PagePermissionSerializer(permission).data)

class UserPermissionListView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def list(self, request):
        users = User.objects.all()
        data = UserPermissionSerializer(users, many=True).data
        return Response(data)


class MyPermissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current user's permissions"""
        user = request.user
        
        # If super admin, return all permissions as True
        if user.is_super_admin:
            pages = ['products', 'marketing', 'orders', 'media', 'offers', 
                     'clients', 'suppliers', 'support', 'sales', 'finance']
            permissions = [
                {
                    'page_name': page,
                    'can_view': True,
                    'can_create': True,
                    'can_edit': True,
                    'can_delete': True
                }
                for page in pages
            ]
            return Response(permissions)
        
        # For regular users, return their actual permissions
        permissions = PagePermission.objects.filter(user=user)
        serializer = PagePermissionSerializer(permissions, many=True)
        return Response(serializer.data)



class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter comments by page_name if provided"""
        queryset = Comment.objects.all()
        page_name = self.request.query_params.get('page_name', None)
        if page_name:
            queryset = queryset.filter(page_name=page_name)
        return queryset

    def check_page_permission(self, page_name, permission_type):
        """Check if user has specific permission for a page"""
        user = self.request.user
        
        # Super admins have all permissions
        if user.is_super_admin:
            return True
        
        # Check user's page permission
        try:
            perm = PagePermission.objects.get(user=user, page_name=page_name)
            return getattr(perm, permission_type, False)
        except PagePermission.DoesNotExist:
            return False

    def list(self, request, *args, **kwargs):
        """View comments - requires 'can_view' permission"""
        page_name = request.query_params.get('page_name')
        if not page_name:
            return Response(
                {"error": "page_name parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not self.check_page_permission(page_name, 'can_view'):
            return Response(
                {"error": "You don't have permission to view comments on this page"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """Create comment - requires 'can_create' permission"""
        page_name = request.data.get('page_name')
        if not page_name:
            return Response(
                {"error": "page_name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not self.check_page_permission(page_name, 'can_create'):
            return Response(
                {"error": "You don't have permission to create comments on this page"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Set the user to the current user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Edit comment - requires 'can_edit' permission"""
        comment = self.get_object()
        
        if not self.check_page_permission(comment.page_name, 'can_edit'):
            return Response(
                {"error": "You don't have permission to edit comments on this page"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Users can only edit their own comments (unless super admin)
        if comment.user != request.user and not request.user.is_super_admin:
            return Response(
                {"error": "You can only edit your own comments"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete comment - requires 'can_delete' permission"""
        comment = self.get_object()
        
        if not self.check_page_permission(comment.page_name, 'can_delete'):
            return Response(
                {"error": "You don't have permission to delete comments on this page"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Users can only delete their own comments (unless super admin)
        if comment.user != request.user and not request.user.is_super_admin:
            return Response(
                {"error": "You can only delete your own comments"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)

