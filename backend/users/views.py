from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserSerializer

from rest_framework import generics, permissions
from .serializers import UserCreateSerializer, UserListSerializer
from .models import PagePermission, User
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
