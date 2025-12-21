import { ReactNode } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, subtitle, breadcrumbs, actions, className }: PageHeaderProps) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${className ?? ''}`}>
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((c, i) => (
                <BreadcrumbItem key={i}>
                  {c.href ? (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  )}
                  {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
