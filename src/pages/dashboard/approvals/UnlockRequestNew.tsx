import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function UnlockRequestNew() {
  const navigate = useNavigate();
  const [recordType, setRecordType] = useState('');
  const [recordId, setRecordId] = useState('');
  const [reason, setReason] = useState('');
  const [approvalLevel, setApprovalLevel] = useState('level1');
  const [department, setDepartment] = useState('');
  const [businessJustification, setBusinessJustification] = useState('');
  const [impactArea, setImpactArea] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onSave = async () => {
    // Validation
    if (!recordType || !recordId || !reason || !businessJustification) {
      setError('Please fill all required fields');
      return;
    }

    if (reason.length < 10) {
      setError('Reason must be at least 10 characters');
      return;
    }

    if (businessJustification.length < 20) {
      setError('Business justification must be at least 20 characters');
      return;
    }

    setError('');

    try {
      setSaving(true);
      const payload = {
        entityType: recordType,
        entityId: recordId,
        reason: reason,
        businessJustification: businessJustification,
        approvalLevel: approvalLevel,
        department: department || 'General',
        impactArea: impactArea || 'Standard',
        requestType: 'unlock',
        status: 'pending'
      };

      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error((await res.json()).message || 'Failed to create unlock request');
      }
      navigate('/dashboard/approvals/unlock-requests');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Could not create unlock request');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Unlock Request</h2>
          <p className="text-gray-600">Request approval to unlock a locked record</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recordType">Record Type *</Label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger id="recordType">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PurchaseOrder">Purchase Order</SelectItem>
                  <SelectItem value="SaleOrder">Sale Order</SelectItem>
                  <SelectItem value="Production">Production Order</SelectItem>
                  <SelectItem value="GRN">Goods Receipt Note</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Quotation">Quotation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordId">Record ID *</Label>
              <Input 
                id="recordId"
                placeholder="e.g., PO-001, SO-001"
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department"
                placeholder="e.g., Procurement, Finance"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approvalLevel">Required Approval Level</Label>
              <Select value={approvalLevel} onValueChange={setApprovalLevel}>
                <SelectTrigger id="approvalLevel">
                  <SelectValue placeholder="Select approval level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level1">Level 1 (Supervisor)</SelectItem>
                  <SelectItem value="level2">Level 2 (Manager)</SelectItem>
                  <SelectItem value="level3">Level 3 (Director)</SelectItem>
                  <SelectItem value="level4">Level 4 (Executive)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="impactArea">Impact Area</Label>
              <Select value={impactArea} onValueChange={setImpactArea}>
                <SelectTrigger id="impactArea">
                  <SelectValue placeholder="Select impact area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard (Low Impact)</SelectItem>
                  <SelectItem value="Moderate">Moderate (Medium Impact)</SelectItem>
                  <SelectItem value="Critical">Critical (High Impact)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Justification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Unlock *</Label>
            <Textarea
              id="reason"
              placeholder="Briefly explain why this record needs to be unlocked (minimum 10 characters)"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={reason.length < 10 && reason.length > 0 ? 'border-yellow-500' : ''}
            />
            <p className="text-xs text-gray-500">{reason.length} characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Business Justification *</Label>
            <Textarea
              id="justification"
              placeholder="Provide detailed business justification for the unlock request (minimum 20 characters)"
              rows={5}
              value={businessJustification}
              onChange={(e) => setBusinessJustification(e.target.value)}
              className={businessJustification.length < 20 && businessJustification.length > 0 ? 'border-yellow-500' : ''}
            />
            <p className="text-xs text-gray-500">{businessJustification.length} characters</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
