# 🚀 Production Management System - Backend

## Simple File-Based Backend Server

This is a lightweight Express.js backend that stores all data in JSON files. Perfect for development, testing, or small-scale deployments.

---

## 📋 Features

- ✅ **Simple & Fast** - No database setup required
- ✅ **File-Based Storage** - All data stored in easy-to-read JSON files
- ✅ **RESTful API** - Complete CRUD operations for all resources
- ✅ **Auto-Initialize** - Creates all data files automatically
- ✅ **CORS Enabled** - Works with any frontend
- ✅ **Backup & Restore** - Easy data export/import
- ✅ **No Dependencies Complexity** - Just Express & CORS

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 3. Server Running!
```
🚀 Backend Server Running at: http://localhost:5000
```

---

## 📁 Data Storage

All data is stored in the `backend/data/` directory as JSON files:

```
backend/
├── data/
│   ├── users.json
│   ├── attendance.json
│   ├── orders.json
│   ├── production.json
│   ├── sales.json
│   ├── purchases.json
│   ├── inventory.json
│   ├── expenses.json
│   ├── payments.json
│   ├── payroll.json
│   ├── outlets.json
│   ├── parties.json
│   ├── quotations.json
│   ├── wastes.json
│   ├── settings.json
│   ├── reports.json
│   └── accounting.json
└── server.js
```

---

## 🔌 API Endpoints

### Available Resources

All resources follow the same RESTful pattern:

- `users` - User management
- `attendance` - Attendance tracking
- `orders` - Order management
- `production` - Production records
- `sales` - Sales transactions
- `purchases` - Purchase orders
- `inventory` - Stock/inventory items
- `expenses` - Expense records
- `payments` - Payment transactions
- `payroll` - Payroll data
- `outlets` - Outlet/branch information
- `parties` - Customer/supplier parties
- `quotations` - Price quotations
- `wastes` - Waste management
- `settings` - Application settings
- `reports` - Generated reports
- `accounting` - Accounting entries

---

## 📡 API Usage

### Base URL
```
http://localhost:5000/api
```

### CRUD Operations

Replace `{resource}` with any resource name (users, orders, sales, etc.)

#### 1. **GET All Records**
```http
GET /api/{resource}
```

**Example:**
```bash
curl http://localhost:5000/api/users
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 10,
  "lastUpdated": "2024-01-11T12:00:00.000Z"
}
```

---

#### 2. **GET Single Record**
```http
GET /api/{resource}/{id}
```

**Example:**
```bash
curl http://localhost:5000/api/users/123-abc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123-abc",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-11T12:00:00.000Z"
  }
}
```

---

#### 3. **POST Create New Record**
```http
POST /api/{resource}
Content-Type: application/json
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1704974400000-abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": "2024-01-11T12:00:00.000Z",
    "updatedAt": "2024-01-11T12:00:00.000Z"
  },
  "message": "user created successfully"
}
```

**Note:** ID, createdAt, and updatedAt are auto-generated!

---

#### 4. **PUT Update Record**
```http
PUT /api/{resource}/{id}
Content-Type: application/json
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/users/123-abc \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123-abc",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "admin",
    "createdAt": "2024-01-11T12:00:00.000Z",
    "updatedAt": "2024-01-11T13:00:00.000Z"
  },
  "message": "user updated successfully"
}
```

---

#### 5. **DELETE Remove Record**
```http
DELETE /api/{resource}/{id}
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/users/123-abc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123-abc",
    "name": "John Smith",
    ...
  },
  "message": "user deleted successfully"
}
```

---

## 🔧 Special Endpoints

### 1. Health Check
```http
GET /api/health
```

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-11T12:00:00.000Z",
  "uptime": 3600
}
```

---

### 2. View All Data
```http
GET /api/all-data
```

Get all data from all resources in one request.

**Response:**
```json
{
  "success": true,
  "data": {
    "users": { "data": [...], "lastUpdated": "..." },
    "orders": { "data": [...], "lastUpdated": "..." },
    "sales": { "data": [...], "lastUpdated": "..." },
    ...
  },
  "timestamp": "2024-01-11T12:00:00.000Z"
}
```

---

### 3. Backup All Data
```http
GET /api/backup
```

Download a complete backup of all data as a JSON file.

**Usage:**
```bash
curl http://localhost:5000/api/backup -o backup.json
```

Or visit in browser to download: `http://localhost:5000/api/backup`

---

### 4. Clear All Data
```http
POST /api/clear-all
```

⚠️ **Warning:** This will delete all data from all resources!

**Example:**
```bash
curl -X POST http://localhost:5000/api/clear-all
```

**Response:**
```json
{
  "success": true,
  "message": "All data cleared successfully",
  "timestamp": "2024-01-11T12:00:00.000Z"
}
```

---

## 📊 View Data Files

To view or edit data manually:

1. Navigate to `backend/data/` directory
2. Open any `.json` file with a text editor
3. Data is formatted nicely for easy reading:

**Example `users.json`:**
```json
{
  "data": [
    {
      "id": "1704974400000-abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "createdAt": "2024-01-11T12:00:00.000Z",
      "updatedAt": "2024-01-11T12:00:00.000Z"
    }
  ],
  "lastUpdated": "2024-01-11T12:00:00.000Z",
  "totalRecords": 1
}
```

You can directly edit these files and the changes will be reflected immediately!

---

## 🔗 Connect Frontend

Update your frontend API URL to point to the backend:

**Example (React/Vite):**

Create a `.env` file in your frontend:
```env
VITE_API_URL=http://localhost:5000/api
```

Then use it in your code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Fetch users
const response = await fetch(`${API_URL}/users`);
const result = await response.json();

// Create user
await fetch(`${API_URL}/users`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});
```

---

## 🛠️ Configuration

### Change Port

Edit `server.js` or use environment variable:
```bash
PORT=3000 npm start
```

### Change Data Directory

Edit the `DATA_DIR` constant in `server.js`:
```javascript
const DATA_DIR = path.join(__dirname, 'data');
```

---

## 📝 Example Usage Scenarios

### Scenario 1: Create a New Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "ORD-001",
    "customer": "ABC Company",
    "amount": 1500.00,
    "status": "pending",
    "items": [
      {"name": "Product A", "quantity": 10, "price": 100},
      {"name": "Product B", "quantity": 5, "price": 100}
    ]
  }'
```

### Scenario 2: Get All Sales
```bash
curl http://localhost:5000/api/sales
```

### Scenario 3: Update Inventory
```bash
curl -X PUT http://localhost:5000/api/inventory/item-123 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50,
    "lastRestocked": "2024-01-11"
  }'
```

### Scenario 4: Record Attendance
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "date": "2024-01-11",
    "checkIn": "09:00:00",
    "checkOut": "17:00:00",
    "status": "present"
  }'
```

---

## 🔍 Troubleshooting

### Server won't start
- Make sure port 5000 is not in use
- Run `npm install` again
- Check Node.js version (requires v14+)

### Can't connect from frontend
- Check CORS settings in `server.js`
- Verify the API URL in your frontend
- Make sure backend server is running

### Data not saving
- Check file permissions in `data/` directory
- Look at server console for error messages
- Verify JSON syntax if editing files manually

---

## 📈 Production Considerations

For production use, consider:

1. **Replace with a real database** (PostgreSQL, MongoDB, MySQL)
2. **Add authentication** (JWT, sessions)
3. **Add validation** (use Joi, Yup, or Zod)
4. **Add rate limiting** (express-rate-limit)
5. **Add logging** (Winston, Morgan)
6. **Use environment variables** (dotenv)
7. **Add data validation**
8. **Implement proper error handling**
9. **Add API documentation** (Swagger/OpenAPI)
10. **Use HTTPS** in production

---

## 🎯 Summary

This backend provides:

✅ Complete REST API for 17 different resources  
✅ Automatic ID generation  
✅ Timestamps (createdAt, updatedAt)  
✅ Easy-to-read JSON storage  
✅ Backup & restore functionality  
✅ No database setup required  
✅ Perfect for development & prototyping  

**Need help?** Check the server console for detailed logs of all requests!

---

## 📞 Support

For issues or questions:
1. Check server console for error logs
2. Verify data files in `backend/data/`
3. Test endpoints with curl or Postman
4. Review this README for API usage

Happy coding! 🚀

---

## 🔐 Authentication & Roles

This backend now includes simple JWT authentication and role-based access control (RBAC).

### Auth Endpoints
- POST /api/auth/login — Login with email or username and password. Returns { token, user }.
- GET  /api/auth/me — Get the current authenticated user.

Include the token in requests:

Authorization: Bearer <JWT_TOKEN>

### Default Dev Accounts
On first run (empty users.json), the server seeds three users:
- Super Admin — username: superadmin, password: password
- Admin — username: admin, password: password
- User — username: user, password: password

Change these in production and set JWT_SECRET env var.

### Roles & Permissions
- super_admin: Full access; manage users; perform /api/clear-all.
- admin: Read all resources; create/update/delete non-user resources; access /api/backup, /api/all-data.
- user: Read resources and own user profile.

### Protected Routes
- All POST/PUT/DELETE on non-user resources require admin or super_admin.
- users resource: listing requires admin/super_admin; single user fetch allows self or admin/super_admin; write operations require super_admin.
- Special endpoints: /api/all-data and /api/backup require admin/super_admin; /api/clear-all requires super_admin.

### Frontend Usage
Store the token in localStorage and the API service will attach it automatically:

// login
// const { token, user } = await api.login({ username: 'admin', password: 'password' }).then(r => r.data || r);
// localStorage.setItem('token', token);

// subsequent requests include Authorization: Bearer <token>
// const users = await api.get('users');

Note: Passwords in the seed are plaintext for development convenience. Use hashed passwords and secure credential management in production.