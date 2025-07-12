
# ReWear Backend API Documentation

### 📦 Features

* ✅ Custom User Model (email login, phone number)
* 🔐 OTP-based verification via email
* 🧾 Register with verified OTP
* 🔄 Password update with current password
* 🧍 Authenticated profile view and update
* 🛂 Admin-only user listing
* 🔑 JWT‑based login & token refresh

---

## 🚀 API Endpoints

### 📩 1. Send OTP

**POST** `/users/auth/send-otp/`

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

**POST** `/users/auth/verify-otp/`

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

**POST** `/users/auth/register/`

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
  "created_at": "2025-07-12T12:00:00Z",
  "updated_at": "2025-07-12T12:00:00Z",
  "is_staff": false,
  "is_superuser": false
}
```

---

### 🔑 4. Login (JWT)

**POST** `/users/auth/login/`

#### Request Body

```json
{
  "email": "example@gmail.com",
  "password": "yourpassword123"
}
```

#### Response

```json
{
  "refresh": "long-refresh-token",
  "access": "short-access-token"
}
```

---

### 🔁 5. Refresh Token

**POST** `/users/auth/token/refresh/`

#### Request Body

```json
{
  "refresh": "long-refresh-token"
}
```

#### Response

```json
{
  "access": "new-access-token"
}
```

---

### 👤 6. Get User Profile

**GET** `/users/auth/me/`
**Headers**:

```
Authorization: Bearer <access_token>
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
  "created_at": "2025-07-12T12:00:00Z",
  "updated_at": "2025-07-12T12:00:00Z",
  "is_staff": false,
  "is_superuser": false
}
```

---

### ✏️ 7. Update User Profile

**PATCH** `/users/auth/me/`
**Headers**:

```
Authorization: Bearer <access_token>
```

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

### 👥 8. List All Users (Admin Only)

**GET** `/users/auth/users/`
**Headers**:

```
Authorization: Bearer <admin_access_token>
```
