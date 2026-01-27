import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Basic pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/dashboard/Home";
import Overview from "./pages/dashboard/Overview";
import UserProfile from "./pages/dashboard/UserProfile";
import ChangeProfile from "./pages/dashboard/ChangeProfile";
import ChangePassword from "./pages/dashboard/ChangePassword";
import SecurityQuestion from "./pages/dashboard/SecurityQuestion";
import NotFound from "./pages/NotFound";

// Factories/Outlets
import AddOutlet from "./pages/dashboard/outlets/AddOutlet";
import OutletsList from "./pages/dashboard/outlets/OutletsList";
import FactoriesEnhanced from "./pages/dashboard/outlets/FactoriesEnhanced";

// Production (core only)
import AddProduction from "./pages/dashboard/production/AddProduction";
import ProductionList from "./pages/dashboard/production/ProductionList";
import AddProductionEnhanced from "./pages/dashboard/production/AddProductionEnhanced";
import ProductionListEnhanced from "./pages/dashboard/production/ProductionListEnhanced";

// Orders
import AddOrder from "./pages/dashboard/orders/AddOrder";
import OrderList from "./pages/dashboard/orders/OrderList";
import OrderDetails from "./pages/dashboard/orders/OrderDetails";
import OrdersEnhanced from "./pages/dashboard/orders/OrdersEnhanced";

// Sales
import AddSale from "./pages/dashboard/sales/AddSale";
import AddSaleEnhanced from "./pages/dashboard/sales/AddSaleEnhanced";
import SaleList from "./pages/dashboard/sales/SaleList";
import SaleListEnhanced from "./pages/dashboard/sales/SaleListEnhanced";
import CustomerListEnhanced from "./pages/dashboard/sales/CustomerListEnhanced";

// Purchases
import AddPurchase from "./pages/dashboard/purchases/AddPurchase";
import AddPurchaseEnhanced from "./pages/dashboard/purchases/AddPurchaseEnhanced";
import PurchaseListEnhanced from "./pages/dashboard/purchases/PurchaseListEnhanced";
import PurchaseOrdersEnhanced from "./pages/dashboard/purchases/PurchaseOrdersEnhanced";
import SupplierPaymentsEnhanced from "./pages/dashboard/purchases/SupplierPaymentsEnhanced";
import SupplierListEnhanced from "./pages/dashboard/purchases/SupplierListEnhanced";
import PurchaseList from "./pages/dashboard/purchases/PurchaseList";
import PurchaseOrder from "./pages/dashboard/purchases/PurchaseOrder";

// Parties
import AddCustomer from "./pages/dashboard/parties/AddCustomer";
import CustomerList from "./pages/dashboard/parties/CustomerList";
import AddSupplier from "./pages/dashboard/parties/AddSupplier";
import SupplierList from "./pages/dashboard/parties/SupplierList";

// Payments
import AddSupplierPayment from "./pages/dashboard/payments/AddSupplierPayment";
import SupplierPaymentList from "./pages/dashboard/payments/SupplierPaymentList";
import AddCustomerReceive from "./pages/dashboard/payments/AddCustomerReceive";
import CustomerReceiveList from "./pages/dashboard/payments/CustomerReceiveList";

// Item Setup (products only)
import AddProductCategory from "./pages/dashboard/item-setup/AddProductCategory";
import ProductCategoryList from "./pages/dashboard/item-setup/ProductCategoryList";
import AddProduct from "./pages/dashboard/item-setup/AddProduct";
import ProductList from "./pages/dashboard/item-setup/ProductList";

// Stock
import ProductStock from "./pages/dashboard/stock/ProductStock";

// Store/Inventory
import MaterialCodesEnhanced from "./pages/dashboard/store/MaterialCodesEnhanced";
import GINGONEnhanced from "./pages/dashboard/store/GINGONEnhanced";
import InventoryReportEnhanced from "./pages/dashboard/store/InventoryReportEnhanced";
import ChallanGatePassEnhanced from "./pages/dashboard/store/ChallanGatePassEnhanced";

// Users & Roles
import AddRole from "./pages/dashboard/users/AddRole";
import RoleList from "./pages/dashboard/users/RoleList";
import AddUser from "./pages/dashboard/users/AddUser";
import UserList from "./pages/dashboard/users/UserList";

// Accounting
import AddAccount from "./pages/dashboard/accounting/AddAccount";
import AccountList from "./pages/dashboard/accounting/AccountList";
import AddTransaction from "./pages/dashboard/accounting/AddTransaction";
import TransactionList from "./pages/dashboard/accounting/TransactionList";
import TrialBalance from "./pages/dashboard/accounting/TrialBalance";
import BalanceSheet from "./pages/dashboard/accounting/BalanceSheet";

// Settings
import CompanyProfile from "./pages/dashboard/settings/CompanyProfile";
import TaxSettings from "./pages/dashboard/settings/TaxSettings";
import WhiteLabel from "./pages/dashboard/settings/WhiteLabel";
import EmailSettings from "./pages/dashboard/settings/EmailSettings";
import DataImport from "./pages/dashboard/settings/DataImport";
import RBACManagement from "./pages/dashboard/settings/RBACManagement";
import BackupRestore from "./pages/dashboard/settings/BackupRestore";

// Reports - Core
import SaleReport from "./pages/dashboard/reports/SaleReport";
import PurchaseReport from "./pages/dashboard/reports/PurchaseReport";
import ProfitLossReport from "./pages/dashboard/reports/ProfitLossReport";
import SupplierDueReport from "./pages/dashboard/reports/SupplierDueReport";
import SupplierBalanceReport from "./pages/dashboard/reports/SupplierBalanceReport";
import SupplierLedger from "./pages/dashboard/reports/SupplierLedger";
import CustomerDueReport from "./pages/dashboard/reports/CustomerDueReport";
import CustomerLedger from "./pages/dashboard/reports/CustomerLedger";

// Reports - New Purchase Reports
import WorkOrderReport from "./pages/dashboard/reports/WorkOrderReport";
import PurchaseOrderReport from "./pages/dashboard/reports/PurchaseOrderReport";
import PurchaseInquiryReport from "./pages/dashboard/reports/PurchaseInquiryReport";
import PurchaseQuotationReport from "./pages/dashboard/reports/PurchaseQuotationReport";
import CapexOrderReport from "./pages/dashboard/reports/CapexOrderReport";
import DuePurchaseDeliveryReport from "./pages/dashboard/reports/DuePurchaseDeliveryReport";
import OrderSheetReport from "./pages/dashboard/reports/OrderSheetReport";

// CRM - New
import CRMLeads from "./pages/dashboard/crm/CRMLeads";
import CRMFollowUps from "./pages/dashboard/crm/CRMFollowUps";

// MRP - New
import MRPWorkOrders from "./pages/dashboard/mrp/MRPWorkOrders";
import ExpandedWorkOrders from "./pages/dashboard/mrp/ExpandedWorkOrders";

// BOM - New
import { BOMList } from "./pages/dashboard/bom/BOMList";
import { AddBOM } from "./pages/dashboard/bom/AddBOM";

// Quality Control - New
import { QCDashboard } from "./pages/dashboard/quality-control/QCDashboard";
import { QCInspections } from "./pages/dashboard/quality-control/QCInspections";
import { QCTemplates } from "./pages/dashboard/quality-control/QCTemplates";
import { NonConformance } from "./pages/dashboard/quality-control/NonConformance";
import { QCInspectionNew } from "./pages/dashboard/quality-control/QCInspectionNew";
import { QCTemplateNew } from "./pages/dashboard/quality-control/QCTemplateNew";
import { NonConformanceNew } from "./pages/dashboard/quality-control/NonConformanceNew";

// GRN - New
import { GRNList } from "./pages/dashboard/grn/GRNList";
import { GRNNew } from "./pages/dashboard/grn/GRNNew";

// Budget - New
import { BudgetList } from "./pages/dashboard/budget/BudgetList";
import { BudgetNew } from "./pages/dashboard/budget/BudgetNew";

// Forecast - New
import { ForecastList } from "./pages/dashboard/forecast/ForecastList";
import { ForecastNew } from "./pages/dashboard/forecast/ForecastNew";

// Approvals - New
import { ApprovalsDashboard } from "./pages/dashboard/approvals/ApprovalsDashboard";
import { PendingApprovals } from "./pages/dashboard/approvals/PendingApprovals";
import { ApprovalHistory } from "./pages/dashboard/approvals/ApprovalHistory";
import { UnlockRequests } from "./pages/dashboard/approvals/UnlockRequests";
import { UnlockRequestNew } from "./pages/dashboard/approvals/UnlockRequestNew";

// Audit - New
import { AuditLogViewer } from "./pages/dashboard/audit/AuditLogViewer";
import { EntityHistory } from "./pages/dashboard/audit/EntityHistory";
import { AuditExportStats } from "./pages/dashboard/audit/AuditExportStats";

// Accounting Periods - New
import { AccountingPeriodsList } from "./pages/dashboard/accounting-periods/AccountingPeriodsList";
import { CloseAccountingPeriod } from "./pages/dashboard/accounting-periods/CloseAccountingPeriod";

// PDF Center - New
import { PdfInvoicesPOs } from "./pages/dashboard/pdf/PdfInvoicesPOs";
import { PdfDeliveryChallan } from "./pages/dashboard/pdf/PdfDeliveryChallan";
import { PdfProductionReports } from "./pages/dashboard/pdf/PdfProductionReports";
import { PdfFinancialStatements } from "./pages/dashboard/pdf/PdfFinancialStatements";

// Features
import NotificationsCenter from "./pages/dashboard/notifications/NotificationsCenter";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: false,
      enabled: false, // Disable automatic queries
    },
  },
});

function AppContent() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <BrowserRouter>
            <KeyboardShortcuts />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Home />} />
                <Route path="overview" element={<Overview />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="change-profile" element={<ChangeProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="security-question" element={<SecurityQuestion />} />
                
                {/* Factories */}
                <Route path="factories" element={<Navigate to="/dashboard/factories/list" replace />} />
                <Route path="factories/add" element={<AddOutlet />} />
                <Route path="factories/list" element={<FactoriesEnhanced />} />
                <Route path="outlets/*" element={<Navigate to="/dashboard/factories/list" replace />} />
                
                {/* Production */}
                <Route path="production/add" element={<AddProduction />} />
                <Route path="production/list" element={<ProductionList />} />
                <Route path="production/add-enhanced" element={<AddProductionEnhanced />} />
                <Route path="production/list-enhanced" element={<ProductionListEnhanced />} />
                
                {/* CRM */}
                <Route path="crm/leads" element={<CRMLeads />} />
                <Route path="crm/followups" element={<CRMFollowUps />} />
                
                {/* MRP */}
                <Route path="mrp/work-orders" element={<MRPWorkOrders />} />
                <Route path="mrp/work-orders-detailed" element={<ExpandedWorkOrders />} />
                
                {/* Orders */}
                <Route path="orders" element={<Navigate to="/dashboard/orders/list" replace />} />
                <Route path="orders/add" element={<AddOrder />} />
                <Route path="orders/list" element={<OrdersEnhanced />} />
                <Route path="orders/:orderId" element={<OrderDetails />} />
                
                {/* Sales */}
                <Route path="sales/add" element={<AddSaleEnhanced />} />
                <Route path="sales/list" element={<SaleListEnhanced />} />
                <Route path="sales/customers" element={<CustomerListEnhanced />} />
                
                {/* Purchases */}
                <Route path="purchases/add" element={<AddPurchaseEnhanced />} />
                <Route path="purchases/list" element={<PurchaseListEnhanced />} />
                <Route path="purchases/purchase-orders" element={<PurchaseOrdersEnhanced />} />
                <Route path="purchases/suppliers" element={<SupplierListEnhanced />} />
                <Route path="purchases/view/:id" element={<PurchaseOrdersEnhanced />} />
                
                {/* Parties */}
                <Route path="parties/add-customer" element={<AddCustomer />} />
                <Route path="parties/customers" element={<CustomerList />} />
                <Route path="parties/add-supplier" element={<AddSupplier />} />
                <Route path="parties/suppliers" element={<SupplierList />} />
                
                {/* Stock */}
                <Route path="stock" element={<ProductStock />} />
                
                {/* Store/Inventory */}
                <Route path="store/material-codes" element={<MaterialCodesEnhanced />} />
                <Route path="store/gin-gon" element={<GINGONEnhanced />} />
                <Route path="store/inventory-report" element={<InventoryReportEnhanced />} />
                <Route path="store/challan-gate-pass" element={<ChallanGatePassEnhanced />} />
                
                {/* Payments */}
                <Route path="supplier-payments/add" element={<AddSupplierPayment />} />
                <Route path="supplier-payments/list" element={<SupplierPaymentsEnhanced />} />
                <Route path="customer-receives/add" element={<AddCustomerReceive />} />
                <Route path="customer-receives/list" element={<CustomerReceiveList />} />

                {/* Accounting */}
                <Route path="accounting/add-account" element={<AddAccount />} />
                <Route path="accounting/accounts" element={<AccountList />} />
                <Route path="accounting/add-transaction" element={<AddTransaction />} />
                <Route path="accounting/transactions" element={<TransactionList />} />
                <Route path="accounting/trial-balance" element={<TrialBalance />} />
                <Route path="accounting/balance-sheet" element={<BalanceSheet />} />
                
                {/* Accounting Periods */}
                <Route path="accounting-periods" element={<AccountingPeriodsList />} />
                <Route path="accounting-periods/close" element={<CloseAccountingPeriod />} />
                
                {/* Item Setup */}
                <Route path="item-setup/add-product-category" element={<AddProductCategory />} />
                <Route path="item-setup/product-categories" element={<ProductCategoryList />} />
                <Route path="item-setup/add-product" element={<AddProduct />} />
                <Route path="item-setup/products" element={<ProductList />} />
                
                {/* Reports */}
                <Route path="reports/sale" element={<SaleReport />} />
                <Route path="reports/purchase" element={<PurchaseReport />} />
                <Route path="reports/profit-loss" element={<ProfitLossReport />} />
                <Route path="reports/supplier-due" element={<SupplierDueReport />} />
                <Route path="reports/supplier-balance" element={<SupplierBalanceReport />} />
                <Route path="reports/supplier-ledger" element={<SupplierLedger />} />
                <Route path="reports/customer-due" element={<CustomerDueReport />} />
                <Route path="reports/customer-ledger" element={<CustomerLedger />} />

                {/* PDF Center */}
                {/* canonical paths */}
                <Route path="pdf/invoices-pos" element={<PdfInvoicesPOs />} />
                <Route path="pdf/delivery-challan" element={<PdfDeliveryChallan />} />
                <Route path="pdf/production-reports" element={<PdfProductionReports />} />
                <Route path="pdf/financial-statements" element={<PdfFinancialStatements />} />
                {/* sidebar-friendly aliases */}
                <Route path="pdf" element={<PdfInvoicesPOs />} />
                <Route path="pdf/invoices" element={<PdfInvoicesPOs />} />
                <Route path="pdf/challan" element={<PdfDeliveryChallan />} />
                <Route path="pdf/production" element={<PdfProductionReports />} />
                <Route path="pdf/financial" element={<PdfFinancialStatements />} />
                
                {/* Purchase Reports (New) */}
                <Route path="reports/work-orders" element={<WorkOrderReport />} />
                <Route path="reports/purchase-orders" element={<PurchaseOrderReport />} />
                <Route path="reports/purchase-inquiry" element={<PurchaseInquiryReport />} />
                <Route path="reports/purchase-quotation" element={<PurchaseQuotationReport />} />
                <Route path="reports/capex-orders" element={<CapexOrderReport />} />
                <Route path="reports/due-delivery" element={<DuePurchaseDeliveryReport />} />
                <Route path="reports/order-sheet" element={<OrderSheetReport />} />
                
                {/* Users */}
                <Route path="users/add-role" element={<AddRole />} />
                <Route path="users/roles" element={<RoleList />} />
                <Route path="users/add" element={<AddUser />} />
                <Route path="users/list" element={<UserList />} />
                
                {/* Notifications */}
                <Route path="notifications" element={<NotificationsCenter />} />
                
                {/* BOM */}
                <Route path="bom" element={<BOMList />} />
                <Route path="bom/add" element={<AddBOM />} />
                <Route path="bom/:id" element={<AddBOM />} />
                
                {/* Quality Control */}
                <Route path="qc" element={<QCDashboard />} />
                <Route path="qc/inspection" element={<QCInspections />} />
                <Route path="qc/inspection/new" element={<QCInspectionNew />} />
                <Route path="qc/inspections" element={<QCInspections />} />
                <Route path="qc/templates" element={<QCTemplates />} />
                <Route path="qc/templates/new" element={<QCTemplateNew />} />
                <Route path="qc/ncr" element={<NonConformance />} />
                <Route path="qc/ncr/new" element={<NonConformanceNew />} />
                
                {/* GRN */}
                <Route path="grn" element={<GRNList />} />
                <Route path="grn/new" element={<GRNNew />} />
                <Route path="grn/:id" element={<GRNList />} />
                
                {/* Budget */}
                <Route path="budget" element={<BudgetList />} />
                <Route path="budget/new" element={<BudgetNew />} />
                <Route path="budget/:id" element={<BudgetList />} />
                
                {/* Forecast */}
                <Route path="forecast" element={<ForecastList />} />
                <Route path="forecast/new" element={<ForecastNew />} />
                <Route path="forecast/:id" element={<ForecastList />} />
                
                {/* Approvals */}
                <Route path="approvals" element={<ApprovalsDashboard />} />
                <Route path="approvals/pending" element={<PendingApprovals />} />
                <Route path="approvals/history" element={<ApprovalHistory />} />
                <Route path="approvals/unlock-requests" element={<UnlockRequests />} />
                <Route path="approvals/unlock-requests/new" element={<UnlockRequestNew />} />
                
                {/* Audit */}
                <Route path="audit/logs" element={<AuditLogViewer />} />
                <Route path="audit/entities" element={<EntityHistory />} />
                <Route path="audit/export" element={<AuditExportStats />} />
                
                {/* Settings */}
                <Route path="settings" element={<Navigate to="/dashboard/settings/company" replace />} />
                <Route path="settings/company" element={<CompanyProfile />} />
                <Route path="settings/tax" element={<TaxSettings />} />
                <Route path="settings/white-label" element={<WhiteLabel />} />
                <Route path="settings/email" element={<EmailSettings />} />
                <Route path="settings/import" element={<DataImport />} />
                <Route path="settings/rbac" element={<RBACManagement />} />
                <Route path="backup" element={<BackupRestore />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
