# 🚀 Super Admin Dashboard

A full-stack web application with role-based access control, separate login portals, and comprehensive permission management system.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles & Permissions](#user-roles--permissions)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## 🎯 Overview

This is a modern admin dashboard application that provides:
- **Dual Login System**: Separate portals for administrators and regular users
- **Role-Based Access Control**: Granular page-level permissions
- **Password Reset**: Secure password recovery system
- **Comment System**: Page-specific commenting with permissions
- **User Management**: Complete CRUD operations for users
- **Permission Management**: Assign and manage user permissions

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ Separate login portals (Admin Portal & User Portal)
- ✅ JWT-based authentication with auto-refresh
- ✅ Password reset functionality with secure tokens
- ✅ Role-based access control (Super Admin & Regular Users)
- ✅ Page-level permissions (View, Create, Edit, Delete)

### 👥 User Management
- ✅ Create users with auto-generated passwords
- ✅ View all users in a searchable table
- ✅ Assign super admin privileges
- ✅ Manage user permissions per page

### 📄 Content Pages
- ✅ Products
- ✅ Marketing
- ✅ Orders
- ✅ Media
- ✅ Offers
- ✅ Clients
- ✅ Suppliers
- ✅ Support
- ✅ Sales
- ✅ Finance

### 💬 Comment System
- ✅ Page-specific comments
- ✅ Create, edit, and delete comments
- ✅ Permission-based access control
- ✅ Real-time comment display

### 🎨 UI/UX
- ✅ Modern, responsive design
- ✅ Gradient backgrounds and glassmorphism effects
- ✅ Color-coded portals (Purple for Admin, Green for Users)
- ✅ Loading states and error handling
- ✅ Smooth transitions and animations

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: CSS-in-JS (Inline Styles)
- **State Management**: React Context API

### Backend
- **Framework**: Django 5.2
- **API**: Django REST Framework
- **Authentication**: Simple JWT
- **Database**: SQLite (Development)
- **CORS**: django-cors-headers

---

## 📁 Project Structure

```
superadmindashboard/
├── backend/                    # Django backend
│   ├── backend/               # Project settings
│   │   ├── settings.py       # Django configuration
│   │   ├── urls.py           # Main URL routing
│   │   └── wsgi.py           # WSGI config
│   ├── users/                # Users app
│   │   ├── models.py         # User, PagePermission, Comment, PasswordResetToken
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # App URL routing
│   │   └── admin.py          # Django admin config
│   ├── db.sqlite3            # SQLite database
│   └── manage.py             # Django management script
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PermissionProtectedRoute.jsx
│   │   │   └── CommentSection.jsx
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.jsx        # Portal selection
│   │   │   ├── AdminLogin.jsx         # Admin login
│   │   │   ├── UserLogin.jsx          # User login
│   │   │   ├── ForgotPassword.jsx     # Password reset request
│   │   │   ├── ResetPassword.jsx      # Password reset form
│   │   │   ├── UserManagement.jsx     # User CRUD
│   │   │   ├── UserPermissions.jsx    # Permission management
│   │   │   ├── Unauthorized.jsx       # Access denied page
│   │   │   └── [ContentPages].jsx     # 10 content pages
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Dependencies
│   └── vite.config.js        # Vite configuration
│
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.8+ 
- **Node.js** 16+ and npm
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd superadmindashboard
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser
# Follow prompts to set email, username, and password

# Start the backend server
python manage.py runserver
```

Backend will run on: `http://127.0.0.1:8000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on: `http://localhost:5174`

### First Time Setup

1. **Access Django Admin** (optional):
   - Go to `http://127.0.0.1:8000/admin/`
   - Login with superuser credentials
   - View/manage database records

2. **Access the Application**:
   - Go to `http://localhost:5174/`
   - You'll see the landing page with two options:
     - **Admin Portal** (for super administrators)
     - **User Portal** (for regular users)

3. **Login as Super Admin**:
   - Click "Admin Portal"
   - Login with superuser credentials
   - Access all features and pages

4. **Create Regular Users**:
   - Navigate to `/dashboard` (User Management)
   - Click "Add New User"
   - Enter email and username
   - System generates a password (copy it!)
   - Assign permissions via `/permissions`

---

## 👥 User Roles & Permissions

### Super Admin
- **Access**: All pages and features
- **Capabilities**:
  - Create, edit, delete users
  - Assign permissions to users
  - Access all content pages
  - Manage all comments
  - Full CRUD operations

### Regular User
- **Access**: Based on assigned permissions
- **Capabilities**:
  - View pages with `can_view` permission
  - Create content with `can_create` permission
  - Edit content with `can_edit` permission
  - Delete content with `can_delete` permission
  - Manage own comments

### Page Permissions

Each user can have permissions for each page:

| Permission | Description |
|------------|-------------|
| `can_view` | View the page content |
| `can_create` | Create new items |
| `can_edit` | Edit existing items |
| `can_delete` | Delete items |

**Available Pages:**
- Products
- Marketing
- Orders
- Media
- Offers
- Clients
- Suppliers
- Support
- Sales
- Finance

---

## 📡 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/auth/
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "user",
    "is_super_admin": false
  }
}
```

#### Token Refresh
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Request Password Reset
```http
POST /api/auth/request-password-reset/
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "If an account exists with this email, a password reset link has been sent.",
  "token": "abc123-def456-..." // Development only
}
```

#### Reset Password
```http
POST /api/auth/reset-password/
Content-Type: application/json

{
  "token": "abc123-def456-...",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}

Response:
{
  "message": "Password has been reset successfully."
}
```

### User Management Endpoints

#### Get My Permissions
```http
GET /api/auth/my-permissions/
Authorization: Bearer <access_token>

Response:
[
  {
    "id": 1,
    "page_name": "products",
    "can_view": true,
    "can_create": true,
    "can_edit": false,
    "can_delete": false
  }
]
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

Response:
{
  "id": 2,
  "email": "newuser@example.com",
  "username": "newuser",
  "is_super_admin": false,
  "auto_password": "Xy9#mK2$pL"
}
```

#### List Users (Admin Only)
```http
GET /api/auth/users/
Authorization: Bearer <access_token>

Response:
[
  {
    "id": 1,
    "email": "user@example.com",
    "username": "user",
    "is_super_admin": false
  }
]
```

### Comment Endpoints

#### Get Comments for Page
```http
GET /api/auth/comments/?page_name=products
Authorization: Bearer <access_token>

Response:
[
  {
    "id": 1,
    "page_name": "products",
    "user": 1,
    "username": "user",
    "user_email": "user@example.com",
    "text": "This is a comment",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
]
```

#### Create Comment
```http
POST /api/auth/comments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "page_name": "products",
  "text": "This is a new comment"
}

Response:
{
  "id": 2,
  "page_name": "products",
  "user": 1,
  "username": "user",
  "user_email": "user@example.com",
  "text": "This is a new comment",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

---

## 🎨 Color Themes

| Portal/Page | Primary Color | Gradient |
|-------------|---------------|----------|
| Landing Page | Blue | `#3b82f6` → `#2563eb` |
| Admin Login | Purple | `#667eea` → `#764ba2` |
| User Login | Green | `#10b981` → `#059669` |
| Forgot Password | Orange | `#f59e0b` → `#d97706` |
| Reset Password | Purple | `#8b5cf6` → `#7c3aed` |

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Automatic token refresh
- ✅ Password hashing (Django's PBKDF2)
- ✅ CORS protection
- ✅ Permission-based access control
- ✅ Secure password reset tokens (1-hour expiration)
- ✅ One-time use reset tokens
- ✅ No email enumeration on password reset

---

## 🧪 Testing

### Test Super Admin Access
1. Login via Admin Portal
2. Should access all pages
3. Can create users and assign permissions

### Test Regular User Access
1. Create a user via Admin Portal
2. Assign specific page permissions
3. Login via User Portal
4. Should only see permitted pages
5. Unauthorized pages redirect to `/unauthorized`

### Test Password Reset
1. Go to User Login → Forgot Password
2. Enter email
3. Check backend console for reset link
4. Click link and set new password
5. Login with new password

---

## 📝 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5174,http://127.0.0.1:5174
```

### Frontend (.env)
```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🚧 Roadmap

- [ ] Add email functionality (SendGrid/Gmail SMTP)
- [ ] Implement real-time notifications
- [ ] Add user profile management
- [ ] Implement activity logs
- [ ] Add data export functionality
- [ ] Create mobile-responsive design
- [ ] Add dark mode toggle
- [ ] Implement file upload system
- [ ] Add dashboard analytics
- [ ] Deploy to production

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Created with ❤️ by Muna PM

---

## 🙏 Acknowledgments

- Django REST Framework for the powerful API toolkit
- React team for the amazing frontend library
- Vite for the blazing-fast build tool
- All contributors and testers

---

## 📞 Support

For support, email support@example.com or open an issue in the repository.

---

**Happy Coding! 🚀**
