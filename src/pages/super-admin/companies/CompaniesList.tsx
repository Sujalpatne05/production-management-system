import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { API_CONFIG } from '@/config/apiConfig';

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt: string;
}

export function CompaniesList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/companies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.API_URL}/super-admin/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete company');
      setCompanies(companies.filter(c => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading companies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-2">Manage all companies on the platform</p>
        </div>
        <Button onClick={() => navigate('/super-admin/companies/add')} className="gap-2">
          <Plus size={18} />
          Add Company
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Companies ({companies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No companies found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Company Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{company.name}</td>
                      <td className="py-3 px-4 text-gray-600">{company.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {company.subscriptionPlan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          company.subscriptionStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.subscriptionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/super-admin/companies/${company.id}`)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/super-admin/companies/${company.id}/edit`)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(company.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
