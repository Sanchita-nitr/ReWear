# ReWear
Community Clothing Exchange

---

## 🛡️ Django REST Auth API with OTP Verification

A lightweight, OTP-based user authentication system using Django Rest Framework and a custom user model.

---

### 📦 Features

* ✅ Custom User Model (email login, phone number)
* 🔐 OTP-based verification via email
* 🧾 Register with verified OTP
* 🔄 Password update with current password
* 🧍 Authenticated profile view and update
* 🛂 Admin-only user listing

---

## 🚀 API Endpoints

### 📩 1. Send OTP

**POST** `/auth/send-otp/`

Send a 6-digit OTP to a registered user’s Gmail account.

#### Request Body

```json
{
  "email": "example@gmail.com"
}
```

#### Response

```json
{
  "detail": "OTP sent successfully."
}
```

---

### ✅ 2. Verify OTP

**POST** `/auth/verify-otp/`

Verify a previously sent OTP.

#### Request Body

```json
{
  "email": "example@gmail.com",
  "otp": "123456"
}
```

#### Response

```json
{
  "detail": "OTP verified successfully."
}
```

---

### 📝 3. Register New User

**POST** `/auth/register/`

Register a user using a previously verified OTP.

#### Request Body

```json
{
  "email": "example@gmail.com",
  "password": "yourpassword123",
  "otp": "123456",
  "first_name": "John",
  "last_name": "Doe",
  "number": "9876543210"
}
```

#### Response

```json
{
  "id": 1,
  "email": "example@gmail.com",
  "first_name": "John",
  "last_name": "Doe",
  "number": "9876543210",
  "is_verified": true,
  ...
}
```

---

### 👤 4. Get User Profile

**GET** `/auth/profile/`
**Headers**: `Authorization: Bearer <access_token>`

#### Response

```json
{
  "id": 1,
  "email": "example@gmail.com",
  "first_name": "John",
  "last_name": "Doe",
  "number": "9876543210",
  "is_verified": true,
  ...
}
```

---

### ✏️ 5. Update User Profile

**PATCH** `/auth/profile/`
**Headers**: `Authorization: Bearer <access_token>`

#### Update Name Example

```json
{
  "first_name": "Jane"
}
```

#### Change Password Example

```json
{
  "current_password": "oldpass123",
  "password": "newpass456"
}
```

---

### 🔐 6. List All Users (Admin Only)

**GET** `/auth/users/`
**Headers**: `Authorization: Bearer <admin_token>`

---

## 📤 Sending OTP Email

* HTML template: `templates/otp_email.html`
* Subject: `"Your OTP for Verification"`
* Expiry: configurable via `OTP_EXPIRY_MINUTES` in `settings.py` (default: 30 minutes)

---

## ⚙️ Setup

1. Set custom user model in `settings.py`:

   ```python
   AUTH_USER_MODEL = "your_app.User"
   ```
2. Add to `INSTALLED_APPS`:

   ```python
   'rest_framework',
   'your_app',
   ```
3. Include URLs:

   ```python
   path("auth/", include("your_app.urls"))
   ```
