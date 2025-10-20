### API Endpoints Documentation

## Auth Routes

- `PUT /api/auth/verifyPasswordReset`  
  Verify password reset OTP and set new password.

- `POST /api/auth/resetPassword`  
  Request password reset OTP.

- `PUT /api/auth/changePassword`  
  Change password (requires authentication).

- `POST /api/auth/login`  
  Login with email and password.
  **Request Payload - Body:**

  ```json
  {
    "email": "email.com",
    "password": "password"
  }
  ```

- `POST /api/auth/verifyOtp`  
  Verify account OTP.
  **Request Payload - Body:**

  ```json
  {
    "userId": "68b5dad2ed3a7d7e2399aae9",
    "otp": "377356"
  }
  ```

- `POST /api/auth/register`  
  Register a new user.
  **Request Payload - Body:**

  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "0234567890",
    "email": "jdoe@mail.com",
    "password": "password",
    "confirmPassword": "password"
  }
  ```

- `GET /api/test`  
  Test endpoint.

---

## User Routes

- `GET /api/users`  
  Get all users (requires authentication and `view:users` permission).

- `GET /api/users/:id`  
  Get a user by ID (requires authentication and `view:user` permission).

- `PUT /api/users/:id`  
  Update a user by ID (requires authentication and `update:user` permission).

- `DELETE /api/users/:id`  
  Delete a user by ID (requires authentication and `delete:user` permission).

- `POST /api/users`  
  Add a new user (requires authentication and `create:user` permission).

---

## Role Routes

- `GET /api/roles`  
  Get all roles (requires authentication and `view:roles` permission).

- `POST /api/roles`  
  Add a new role (requires authentication and `create:role` permission).

- `GET /api/roles/:id`  
  Get a role by ID (requires authentication and `view:role` permission).

- `PUT /api/roles/:id`  
  Update a role by ID (requires authentication and `update:role` permission).

- `DELETE /api/roles/:id`  
  Delete a role by ID (requires authentication and `delete:role` permission).

---

## Permission Routes

- `GET /api/permissions`  
  Get all permissions (requires authentication and `view:permissions` permission).

- `POST /api/permissions`  
  Upload permissions (no authentication required, but requires a valid key).

---
