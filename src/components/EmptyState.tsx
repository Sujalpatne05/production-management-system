import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState = ({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) => {
  return (
    <Card className={`p-6 text-center space-y-3 ${className ?? ''}`}>
      {icon && <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center">{icon}</div>}
      <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button onClick={onAction} className="w-full sm:w-auto">{actionLabel}</Button>
        </div>
      )}
    </Card>
  );
};

export default EmptyState;
