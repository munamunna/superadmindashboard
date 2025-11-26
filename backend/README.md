# 🔧 Super Admin Dashboard - Backend

Django REST Framework backend for the Super Admin Dashboard application.

## 🚀 Quick Start

```bash
# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Server runs on: `http://127.0.0.1:8000`

## 📋 Features

- ✅ RESTful API with Django REST Framework
- ✅ JWT authentication with auto-refresh
- ✅ Role-based access control
- ✅ User management with auto-generated passwords
- ✅ Page-level permission system
- ✅ Password reset with secure tokens
- ✅ Comment system with permissions
- ✅ CORS enabled for frontend
- ✅ Django Admin panel

## 🛠️ Tech Stack

- **Django** 5.2
- **Django REST Framework** 3.15.2
- **Simple JWT** 5.4.0
- **django-cors-headers** 4.6.0
- **SQLite** (Development database)

## 📁 Project Structure

```
backend/
├── backend/                # Project settings
│   ├── settings.py        # Django configuration
│   ├── urls.py            # Main URL routing
│   └── wsgi.py            # WSGI config
├── users/                 # Users app
│   ├── models.py          # Data models
│   ├── views.py           # API views
│   ├── serializers.py     # DRF serializers
│   ├── urls.py            # App URL routing
│   ├── admin.py           # Django admin config
│   └── migrations/        # Database migrations
├── db.sqlite3             # SQLite database
└── manage.py              # Django management script
```

## 🗄️ Database Models

### User Model
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_super_admin = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
```

### PagePermission Model
```python
class PagePermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    page_name = models.CharField(max_length=50)
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
```

### PasswordResetToken Model
```python
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
```

### Comment Model
```python
class Comment(models.Model):
    page_name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## 🔐 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Token Refresh
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "refresh_token_here"
}
```

#### Request Password Reset
```http
POST /api/auth/request-password-reset/
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password/
Content-Type: application/json

{
  "token": "uuid-token-here",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

### User Management

#### Get My Permissions
```http
GET /api/auth/my-permissions/
Authorization: Bearer <access_token>
```

#### Create User (Admin Only)
```http
POST /api/auth/users/create/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "username": "newuser",
  "is_super_admin": false
}
```

#### List Users (Admin Only)
```http
GET /api/auth/users/
Authorization: Bearer <access_token>
```

#### Get User Permissions (Admin Only)
```http
GET /api/auth/user-permissions/
Authorization: Bearer <access_token>
```

### Permissions Management

#### List Permissions (Admin Only)
```http
GET /api/auth/permissions/
Authorization: Bearer <access_token>
```

#### Create/Update Permission (Admin Only)
```http
POST /api/auth/permissions/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "user": 1,
  "page_name": "products",
  "can_view": true,
  "can_create": true,
  "can_edit": false,
  "can_delete": false
}
```

#### Delete Permission (Admin Only)
```http
DELETE /api/auth/permissions/{id}/
Authorization: Bearer <access_token>
```

### Comments

#### List Comments
```http
GET /api/auth/comments/?page_name=products
Authorization: Bearer <access_token>
```

#### Create Comment
```http
POST /api/auth/comments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "page_name": "products",
  "text": "This is a comment"
}
```

#### Update Comment
```http
PUT /api/auth/comments/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "Updated comment text"
}
```

#### Delete Comment
```http
DELETE /api/auth/comments/{id}/
Authorization: Bearer <access_token>
```

## ⚙️ Configuration

### Settings (`backend/settings.py`)

#### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

CORS_ALLOW_CREDENTIALS = True
```

#### JWT Configuration
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

#### Database Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with PBKDF2
- ✅ CORS protection
- ✅ Permission-based access control
- ✅ Secure password reset tokens
- ✅ Token expiration (1 hour for reset tokens)
- ✅ One-time use reset tokens
- ✅ No email enumeration

## 🗃️ Database Management

### Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migrations
python manage.py showmigrations

# Rollback migration
python manage.py migrate users 0001
```

### Django Admin

Access at: `http://127.0.0.1:8000/admin/`

Registered models:
- Users
- Page Permissions
- Password Reset Tokens
- Comments

### Django Shell

```bash
# Open shell
python manage.py shell

# Example queries
from users.models import User, PagePermission

# Get all users
users = User.objects.all()

# Get specific user
user = User.objects.get(email='user@example.com')

# Get user permissions
permissions = PagePermission.objects.filter(user=user)

# Create permission
PagePermission.objects.create(
    user=user,
    page_name='products',
    can_view=True,
    can_create=True
)
```

## 🧪 Testing

### Manual Testing

```bash
# Test login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Test protected endpoint
curl http://127.0.0.1:8000/api/auth/my-permissions/ \
  -H "Authorization: Bearer <access_token>"
```

### Unit Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## 📊 Available Page Names

The following page names are available for permissions:

- `products`
- `marketing`
- `orders`
- `media`
- `offers`
- `clients`
- `suppliers`
- `support`
- `sales`
- `finance`

## 🔧 Management Commands

### Create Superuser
```bash
python manage.py createsuperuser
```

### Change User Password
```bash
python manage.py changepassword user@example.com
```

### Database Shell
```bash
python manage.py dbshell
```

### Collect Static Files
```bash
python manage.py collectstatic
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use PostgreSQL/MySQL instead of SQLite
- [ ] Set strong `SECRET_KEY`
- [ ] Configure email backend (SendGrid/SMTP)
- [ ] Set up HTTPS
- [ ] Configure static files serving
- [ ] Set up logging
- [ ] Enable database backups
- [ ] Configure CORS for production domain

### Environment Variables

Create `.env` file:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgres://user:password@localhost/dbname
CORS_ALLOWED_ORIGINS=https://yourdomain.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

Load in `settings.py`:

```python
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')
```

## 🐛 Troubleshooting

### Issue: Migrations not applying
```bash
python manage.py migrate --run-syncdb
```

### Issue: CORS errors
Check `CORS_ALLOWED_ORIGINS` in settings.py

### Issue: Token expired
Tokens expire after 60 minutes. Use refresh token to get new access token.

### Issue: Permission denied
Verify user has required permissions in Django admin

## 📚 Learn More

- [Django Documentation](https://docs.djangoproject.com)
- [Django REST Framework](https://www.django-rest-framework.org)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io)

## 🤝 Contributing

See main project README for contribution guidelines.

---

**Built with Django REST Framework** 🚀
