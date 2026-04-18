import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/config/apiConfig';

export function AddCompany() {
  const [formData, setFormData] = useState({
    // Company details
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    subscriptionPlan: 'starter',
    // Admin details
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    adminConfirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Company validation
    if (!formData.name.trim()) errors.name = 'Company name is required';
    if (!formData.email.trim()) errors.email = 'Company email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) errors.phone = 'Invalid phone format';

    // Admin validation
    if (!formData.adminName.trim()) errors.adminName = 'Admin name is required';
    if (!formData.adminEmail.trim()) errors.adminEmail = 'Admin email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) errors.adminEmail = 'Invalid email format';
    if (formData.adminPhone && !/^[\d\s\-\+\(\)]+$/.test(formData.adminPhone)) errors.adminPhone = 'Invalid phone format';
    if (!formData.adminPassword) errors.adminPassword = 'Password is required';
    else if (formData.adminPassword.length < 8) errors.adminPassword = 'Password must be at least 8 characters';
    if (formData.adminPassword !== formData.adminConfirmPassword) errors.adminConfirmPassword = 'Passwords do not match';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/companies-with-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            website: formData.website,
            subscriptionPlan: formData.subscriptionPlan,
          },
          admin: {
            name: formData.adminName,
            email: formData.adminEmail,
            phone: formData.adminPhone,
            password: formData.adminPassword,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create company and admin');
      }

      navigate('/super-admin/companies');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Company & Admin</h1>
        <p className="text-gray-600 mt-2">Create a new company and assign an admin in one step</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter company name"
                />
                {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter company email"
                />
                {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter website URL"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Plan
                </label>
                <select
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.adminName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin name"
                />
                {fieldErrors.adminName && <p className="text-red-500 text-sm mt-1">{fieldErrors.adminName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email *
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.adminEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin email"
                />
                {fieldErrors.adminEmail && <p className="text-red-500 text-sm mt-1">{fieldErrors.adminEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Phone
                </label>
                <input
                  type="tel"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.adminPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin phone"
                />
                {fieldErrors.adminPhone && <p className="text-red-500 text-sm mt-1">{fieldErrors.adminPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.adminPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password (min 8 characters)"
                />
                {fieldErrors.adminPassword && <p className="text-red-500 text-sm mt-1">{fieldErrors.adminPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="adminConfirmPassword"
                  value={formData.adminConfirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    fieldErrors.adminConfirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
                {fieldErrors.adminConfirmPassword && <p className="text-red-500 text-sm mt-1">{fieldErrors.adminConfirmPassword}</p>}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Creating...' : 'Create Company & Admin'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/super-admin/companies')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
