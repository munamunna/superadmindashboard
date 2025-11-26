from django.urls import path,include
from .views import (LoginView, UserCreateView, UserListView, PermissionViewSet, 
                    UserPermissionListView, CommentViewSet, MyPermissionsView,
                    RequestPasswordResetView, PasswordResetView)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('permissions', PermissionViewSet, basename='permissions')
router.register('comments', CommentViewSet, basename='comments')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/create/', UserCreateView.as_view(), name='user_create'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('user-permissions/', UserPermissionListView.as_view({'get': 'list'}), name='user_permission_list'),
    path('my-permissions/', MyPermissionsView.as_view(), name='my_permissions'),
    path('request-password-reset/', RequestPasswordResetView.as_view(), name='request_password_reset'),
    path('reset-password/', PasswordResetView.as_view(), name='reset_password'),
    path('', include(router.urls)),
]


