import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderProps {
  title: string;
  description: string;
}

export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">This section is coming soon</p>
            <p className="text-sm mt-2">Feature under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
