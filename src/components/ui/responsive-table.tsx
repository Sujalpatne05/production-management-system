import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReactNode } from "react";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => ReactNode;
  mobileLabel?: string;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  mobileCardRender?: (row: any) => ReactNode;
}

export function ResponsiveTable({ 
  columns, 
  data, 
  onRowClick, 
  emptyMessage = "No data found",
  mobileCardRender 
}: ResponsiveTableProps) {
  return (
    <>
      {/* Mobile Card View */}
      {mobileCardRender && (
        <div className="sm:hidden space-y-3">
          {data.length > 0 ? (
            data.map((row, index) => (
              <Card key={index} className="p-4">
                {mobileCardRender(row)}
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8 text-sm">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
      
      {/* Desktop Table View */}
      <div className={`${mobileCardRender ? 'hidden sm:block' : ''} rounded-md border overflow-x-auto`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index} className={col.hideOnMobile ? 'hidden sm:table-cell' : ''}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell 
                      key={colIndex}
                      className={col.hideOnMobile ? 'hidden sm:table-cell' : ''}
                    >
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
