# Learning Resources: Super Admin Restriction

This folder contains the files that were modified or created to restrict dashboard access to super admins only.

## Files

1.  **`ProtectedRoute.jsx`**:
    -   **Purpose**: A wrapper component that checks if the user is authenticated and is a super admin.
    -   **Logic**:
        -   It consumes `AuthContext` to get the `user` object.
        -   If `user` is missing or `user.is_super_admin` is false, it redirects to the login page (`/`).
        -   If authorized, it renders the child routes using `<Outlet />`.

2.  **`App.jsx`**:
    -   **Change**: Imported `ProtectedRoute` and wrapped the `/dashboard` and `/permissions` routes with it.
    -   **Effect**: These routes are now children of `ProtectedRoute`, meaning the protection logic runs before they are rendered.

3.  **`AuthContext.jsx`**:
    -   **Change**: Modified the `login` function to return `res.data`.
    -   **Reason**: This allows the caller (Login page) to immediately access the user data after a successful login to perform checks (like checking for super admin status).

4.  **`Login.jsx`**:
    -   **Change**: Updated `handleSubmit` to check `data.user.is_super_admin`.
    -   **Logic**:
        -   If the user is a super admin, they are navigated to `/dashboard`.
        -   If not, they see an alert "Access denied: Super Admin only" and remain on the login page (or you could redirect them elsewhere).

## How it works together

1.  **Login**: User logs in. `AuthContext` updates the state and returns user data. `Login.jsx` checks if they are a super admin.
2.  **Navigation**: If they are a super admin, they go to `/dashboard`.
3.  **Protection**: If someone tries to go to `/dashboard` directly (e.g., via URL), `App.jsx` renders `ProtectedRoute`.
4.  **Verification**: `ProtectedRoute` checks the `AuthContext` state. If the user is not a super admin, they are kicked back to `/`.
