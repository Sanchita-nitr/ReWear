
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


# Items API Documentation

This document describes the REST API endpoints for managing `Item` and `ItemImage` resources in the ReWear backend.

---

## Authentication

* All write operations (POST, PUT/PATCH, DELETE) require authentication via Token or Session.
* Read operations (GET) on items are available to unauthenticated users; image endpoints require authentication.

| Method | Header                          | Description                         |
| :----: | ------------------------------- | ----------------------------------- |
|   All  | `Authorization: Token <token>`  | Token-based auth                    |
|   All  | `Cookie: sessionid=<sessionid>` | Session cookie (if using browsable) |

---

## 1. Items

### 1.1 List Items

```
GET /api/items/?search=<query>&ordering=<field>&page=<n>
```

* **Description**: Retrieve a paginated list of items.
* **Query Parameters**:

  * `search`: case-insensitive search on `title`, `description`, `category`, and `tags` (e.g. `?search=vintage`).
  * `ordering`: sort by `created_at`, `-created_at`, `updated_at`, etc. (e.g. `?ordering=-created_at`).
  * `page`: page number (default 1).

#### Example Request

```http
GET /api/items/?search=electronics&ordering=-created_at&page=1 HTTP/1.1
```

#### Example Response (200 OK)

```json
{
  "count": 42,
  "next": "http://api.rewear.com/api/items/?page=2",
  "previous": null,
  "results": [
    {
      "id": 7,
      "title": "Vintage Camera",
      "description": "Classic film camera, working condition.",
      "category": "Electronics",
      "size": "Medium",
      "type": "Camera",
      "condition": "Good",
      "availability": true,
      "status": "available",
      "uploaded_by": "alice",
      "tags": ["vintage", "film"],
      "images": [
        {"id": 21, "image": "http://.../items/21.jpg"}
      ],
      "created_at": "2025-07-10T14:22:00Z",
      "updated_at": "2025-07-11T09:05:00Z"
    }
  ]
}
```

### 1.2 Retrieve Item

```
GET /api/items/{id}/
```

* **Description**: Fetch details for a single item by its `id`.

#### Example Request

```http
GET /api/items/7/ HTTP/1.1
Host: api.rewear.com
```

#### Example Response (200 OK)

```json
{
  "id": 7,
  "title": "Vintage Camera",
  "description": "Classic film camera, working condition.",
  "category": "Electronics",
  "size": "Medium",
  "type": "Camera",
  "condition": "Good",
  "availability": true,
  "status": "available",
  "uploaded_by": "alice",
  "tags": ["vintage", "film"],
  "images": [
    {"id": 21, "image": "http://.../items/21.jpg"}
  ],
  "created_at": "2025-07-10T14:22:00Z",
  "updated_at": "2025-07-11T09:05:00Z"
}
```

### 1.3 Create Item

```
POST /api/items/
```

* **Description**: Create a new item.
* **Authentication**: Required
* **Request Body (JSON)**:

  * `title` (string, max 200, required)
  * `description` (string, optional)
  * `category` (string, required)
  * `size` (string, optional)
  * `type` (string, optional)
  * `condition` (string, required)
  * `availability` (boolean, default `true`)
  * `tags` (array of strings, optional)

#### Example Request

```http
POST /api/items/ HTTP/1.1
Host: api.rewear.com
Authorization: Token 123abc
Content-Type: application/json

{
  "title": "Yoga Mat",
  "description": "Eco-friendly mat, barely used.",
  "category": "Fitness",
  "size": "Large",
  "condition": "Like New",
  "availability": true,
  "tags": ["fitness", "wellness"]
}
```

#### Example Response (201 Created)

```json
{
  "id": 43,
  "title": "Yoga Mat",
  "description": "Eco-friendly mat, barely used.",
  "category": "Fitness",
  "size": "Large",
  "type": "",
  "condition": "Like New",
  "availability": true,
  "status": "available",
  "uploaded_by": "bob",
  "tags": ["fitness", "wellness"],
  "images": [],
  "created_at": "2025-07-12T06:45:00Z",
  "updated_at": "2025-07-12T06:45:00Z"
}
```

### 1.4 Update Item

```
PUT /api/items/{id}/
PATCH /api/items/{id}/
```

* **Description**: Replace or partially update an item.
* **Authentication**: Required; only the `uploaded_by` user may modify.
* **Body**: Same fields as create, minus read-only (`status`, `uploaded_by`, timestamps).

#### Example PATCH

```http
PATCH /api/items/43/ HTTP/1.1
Host: api.rewear.com
Authorization: Token 123abc
Content-Type: application/json

{
  "availability": false
}
```

### 1.5 Delete Item

```
DELETE /api/items/{id}/
```

* **Description**: Remove an item. Only the owner may delete.
* **Authentication**: Required

#### Example Request

```http
DELETE /api/items/43/ HTTP/1.1
Host: api.rewear.com
Authorization: Token 123abc
```

#### Example Response (204 No Content)

```
<empty>
```

---

## 2. Item Images

### 2.1 List All Images

```
GET /api/item-images/
```

* **Description**: Retrieve all image records (across all items).
* **Authentication**: Required

### 2.2 Upload Image

```
POST /api/item-images/
```

* **Description**: Upload a new image for an existing item.
* **Authentication**: Required
* **Content-Type**: `multipart/form-data`
* **Form Fields**:

  * `item` (integer ID of the item)
  * `image` (file)

#### Example cURL

```bash
curl -X POST \
  -H "Authorization: Token 123abc" \
  -F "item=43" \
  -F "image=@/path/to/yoga_mat.jpg" \
  http://api.rewear.com/api/item-images/
```

#### Example Response (201 Created)

```json
{
  "id": 56,
  "image": "http://.../items/56.jpg"
}
```

### 2.3 Delete Image

```
DELETE /api/item-images/{id}/
```

* **Description**: Remove an image record (and file).
* **Authentication**: Required; any authenticated user can delete (or you can restrict to the item owner).

#### Example Request

```http
DELETE /api/item-images/56/ HTTP/1.1
Host: api.rewear.com
Authorization: Token 123abc
```

#### Example Response (204 No Content)

```
<empty>
```

---

## 3. Error Codes

| Code | Meaning                                    |
| :--: | ------------------------------------------ |
|  400 | Bad Request (validation error)             |
|  401 | Unauthorized (missing/invalid credentials) |
|  403 | Forbidden (permission denied)              |
|  404 | Not Found (e.g. wrong `id`)                |
|  500 | Server Error                               |

---

## 4. Pagination

* All list endpoints return paginated results by default.
* Response keys: `count`, `next`, `previous`, `results`.

---

*Last updated: 2025-07-12*

