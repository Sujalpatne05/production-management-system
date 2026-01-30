// ============================================
// Frontend Integration Example
// ============================================
// This file shows how to connect your React/Vue/Angular frontend
// to the backend API

const API_URL = 'http://localhost:5000/api';

// Simple auth token storage
function setToken(token) {
  try { localStorage.setItem('token', token); } catch {}
}
function getToken() {
  try { return localStorage.getItem('token'); } catch { return null; }
}

// ============================================
// 1. BASIC FETCH EXAMPLES
// ============================================

// Get all records from a resource
async function getAllRecords(resource) {
  try {
    const response = await fetch(`${API_URL}/${resource}`);
    const result = await response.json();

    if (result.success) {
      console.log(`✓ Fetched ${result.total} records from ${resource}`);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
}

// Get a single record by ID
async function getRecordById(resource, id) {
  try {
    const response = await fetch(`${API_URL}/${resource}/${id}`);
    const result = await response.json();

    if (result.success) {
      console.log('✓ Record found:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching record:', error);
    return null;
  }
}

// Create a new record
async function createRecord(resource, data) {
  try {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✓ Record created:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error creating record:', error);
    return null;
  }
}

// Update an existing record
async function updateRecord(resource, id, data) {
  try {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✓ Record updated:', result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Error updating record:', error);
    return null;
  }
}

// Delete a record
async function deleteRecord(resource, id) {
  try {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      console.log('✓ Record deleted');
      return true;
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    return false;
  }
}

// ============================================
// 2. REACT HOOKS EXAMPLES
// ============================================

// Custom hook for fetching data
function useDataFetch(resource) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${resource}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resource]);

  return { data, loading, error };
}

// Example React Component using the hook
function UsersList() {
  const { data: users, loading, error } = useDataFetch('users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users ({users.length})</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// 3. API SERVICE CLASS (Recommended)
// ============================================

class ApiService {
  constructor(baseUrl = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // attach Authorization if available
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(resource, id = null) {
    const endpoint = id ? `/${resource}/${id}` : `/${resource}`;
    return this.request(endpoint);
  }

  // POST request
  async post(resource, data) {
    return this.request(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(resource, id, data) {
    return this.request(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(resource, id) {
    return this.request(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  }

  // Special endpoints
  async getAllData() {
    return this.request('/all-data');
  }

  async backup() {
    return this.request('/backup');
  }

  async health() {
    return this.request('/health');
  }

  // Auth
  async login({ email, username, password }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, username, password })
    });
  }

  async me() {
    return this.request('/auth/me');
  }
}

// Usage
const api = new ApiService();

// ============================================
// 4. REAL-WORLD EXAMPLES
// ============================================

// Example 1: User Management
async function userManagementExample() {
  const api = new ApiService();

  // Login first (dev credentials)
  const loginRes = await api.login({ username: 'superadmin', password: 'password' });
  if (loginRes.success) {
    setToken(loginRes.token);
    console.log('Logged in as:', loginRes.user);
  } else {
    console.warn('Login failed:', loginRes.error);
    return;
  }

  // Create a new user
  const newUser = await api.post('users', {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active'
  });
  console.log('Created user:', newUser);

  // Get all users
  const usersResponse = await api.get('users');
  console.log('All users:', usersResponse.data);

  // Update user
  const updated = await api.put('users', newUser.data.id, {
    name: 'John Smith',
    status: 'inactive'
  });
  console.log('Updated user:', updated);

  // Delete user
  await api.delete('users', newUser.data.id);
  console.log('User deleted');
}

// Example 2: Order Management
async function orderManagementExample() {
  const api = new ApiService();

  // Ensure logged in
  if (!getToken()) {
    const loginRes = await api.login({ username: 'admin', password: 'password' });
    if (loginRes.success) setToken(loginRes.token);
  }

  // Create an order
  const order = await api.post('orders', {
    orderNumber: 'ORD-' + Date.now(),
    customer: 'ABC Company',
    customerEmail: 'contact@abc.com',
    items: [
      { name: 'Product A', quantity: 10, price: 100 },
      { name: 'Product B', quantity: 5, price: 200 }
    ],
    totalAmount: 2000,
    status: 'pending',
    orderDate: new Date().toISOString()
  });
  console.log('Order created:', order);

  // Get all pending orders
  const ordersResponse = await api.get('orders');
  const pendingOrders = ordersResponse.data.filter(o => o.status === 'pending');
  console.log('Pending orders:', pendingOrders);

  // Update order status
  await api.put('orders', order.data.id, {
    status: 'processing'
  });

  // Complete the order
  await api.put('orders', order.data.id, {
    status: 'completed',
    completedDate: new Date().toISOString()
  });
}

// Example 3: Inventory Management
async function inventoryExample() {
  const api = new ApiService();

  if (!getToken()) {
    const loginRes = await api.login({ username: 'admin', password: 'password' });
    if (loginRes.success) setToken(loginRes.token);
  }

  // Add inventory item
  const item = await api.post('inventory', {
    sku: 'PROD-001',
    name: 'Product Name',
    category: 'Electronics',
    quantity: 100,
    unitPrice: 50,
    reorderLevel: 20,
    supplier: 'Supplier ABC'
  });

  // Update stock quantity
  await api.put('inventory', item.data.id, {
    quantity: item.data.quantity - 10 // Reduce by 10
  });

  // Get low stock items
  const inventoryResponse = await api.get('inventory');
  const lowStock = inventoryResponse.data.filter(
    item => item.quantity <= item.reorderLevel
  );
  console.log('Low stock items:', lowStock);
}

// Example 4: Attendance Tracking
async function attendanceExample() {
  const api = new ApiService();

  if (!getToken()) {
    const loginRes = await api.login({ username: 'admin', password: 'password' });
    if (loginRes.success) setToken(loginRes.token);
  }

  // Record check-in
  const attendance = await api.post('attendance', {
    userId: 'user-123',
    userName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    checkIn: new Date().toISOString(),
    checkOut: null,
    status: 'present'
  });

  // Record check-out
  await api.put('attendance', attendance.data.id, {
    checkOut: new Date().toISOString()
  });

  // Get today's attendance
  const today = new Date().toISOString().split('T')[0];
  const attendanceResponse = await api.get('attendance');
  const todayAttendance = attendanceResponse.data.filter(
    a => a.date === today
  );
  console.log('Today\'s attendance:', todayAttendance);
}

// Example 5: Sales Tracking
async function salesExample() {
  const api = new ApiService();

  if (!getToken()) {
    const loginRes = await api.login({ username: 'admin', password: 'password' });
    if (loginRes.success) setToken(loginRes.token);
  }

  // Record a sale
  const sale = await api.post('sales', {
    invoiceNumber: 'INV-' + Date.now(),
    customer: 'Customer XYZ',
    items: [
      { product: 'Product A', quantity: 2, price: 100, total: 200 },
      { product: 'Product B', quantity: 1, price: 150, total: 150 }
    ],
    subtotal: 350,
    tax: 35,
    discount: 10,
    total: 375,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    saleDate: new Date().toISOString()
  });
  console.log('Sale recorded:', sale);

  // Get today's sales report
  const today = new Date().toISOString().split('T')[0];
  const salesResponse = await api.get('sales');
  const todaySales = salesResponse.data.filter(
    s => s.saleDate.startsWith(today)
  );

  const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  console.log(`Today's revenue: $${totalRevenue}`);
}

// ============================================
// 5. REACT CONTEXT EXAMPLE (Advanced)
// ============================================

// Create API Context
const ApiContext = React.createContext();

function ApiProvider({ children }) {
  const api = new ApiService();

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

// Custom hook to use API
function useApi() {
  const context = React.useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}

// Usage in component
function MyComponent() {
  const api = useApi();
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    async function loadData() {
      const response = await api.get('users');
      setData(response.data);
    }
    loadData();
  }, [api]);

  return <div>Data loaded: {data.length} items</div>;
}

// Wrap your app
function App() {
  return (
    <ApiProvider>
      <MyComponent />
    </ApiProvider>
  );
}

// ============================================
// 6. ERROR HANDLING EXAMPLE
// ============================================

async function robustApiCall() {
  const api = new ApiService();

  try {
    const response = await api.get('users');

    if (response.success) {
      console.log('✓ Success:', response.data);
      return response.data;
    } else {
      console.error('✗ API Error:', response.error);
      return null;
    }
  } catch (error) {
    console.error('✗ Network Error:', error.message);

    // Show user-friendly error message
    alert('Failed to load data. Please check your connection.');

    return null;
  }
}

// ============================================
// 7. BATCH OPERATIONS
// ============================================

async function batchOperations() {
  const api = new ApiService();

  // Create multiple records at once
  const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' }
  ];

  const promises = users.map(user => api.post('users', user));
  const results = await Promise.all(promises);

  console.log('Created users:', results);
}

// ============================================
// EXPORT FOR USE IN YOUR PROJECT
// ============================================

export {
  ApiService,
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  useDataFetch,
  ApiProvider,
  useApi
};

// ============================================
// QUICK REFERENCE
// ============================================
/*

Resources Available:
- users
- attendance
- orders
- production
- sales
- purchases
- inventory
- expenses
- payments
- payroll
- outlets
- parties
- quotations
- wastes
- settings
- reports
- accounting

API Endpoints:
GET    /api/{resource}        - Get all records
GET    /api/{resource}/{id}   - Get single record
POST   /api/{resource}        - Create new record
PUT    /api/{resource}/{id}   - Update record
DELETE /api/{resource}/{id}   - Delete record

Special Endpoints:
GET  /api/health              - Server health check
GET  /api/all-data            - Get all data
GET  /api/backup              - Download backup
POST /api/clear-all           - Clear all data

*/
