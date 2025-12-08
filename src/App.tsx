import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/dashboard/Home";
import Overview from "./pages/dashboard/Overview";
import UserProfile from "./pages/dashboard/UserProfile";
import ChangeProfile from "./pages/dashboard/ChangeProfile";
import ChangePassword from "./pages/dashboard/ChangePassword";
import SecurityQuestion from "./pages/dashboard/SecurityQuestion";
import AddOutlet from "./pages/dashboard/outlets/AddOutlet";
import OutletsList from "./pages/dashboard/outlets/OutletsList";
import AddProduction from "./pages/dashboard/production/AddProduction";
import ProductionList from "./pages/dashboard/production/ProductionList";
import AddProductionLoss from "./pages/dashboard/production/AddProductionLoss";
import ProductionLossList from "./pages/dashboard/production/ProductionLossList";
import DemandForecastingByOrder from "./pages/dashboard/production/DemandForecastingByOrder";
import DemandForecastingByProduct from "./pages/dashboard/production/DemandForecastingByProduct";
import AddOrder from "./pages/dashboard/orders/AddOrder";
import OrderList from "./pages/dashboard/orders/OrderList";
import OrderDetails from "./pages/dashboard/orders/OrderDetails";
import AddSale from "./pages/dashboard/sales/AddSale";
import SaleList from "./pages/dashboard/sales/SaleList";
import AddPurchase from "./pages/dashboard/purchases/AddPurchase";
import PurchaseList from "./pages/dashboard/purchases/PurchaseList";
import AddCustomer from "./pages/dashboard/parties/AddCustomer";
import CustomerList from "./pages/dashboard/parties/CustomerList";
import AddSupplier from "./pages/dashboard/parties/AddSupplier";
import SupplierList from "./pages/dashboard/parties/SupplierList";
import AddAttendance from "./pages/dashboard/attendance/AddAttendance";
import AttendanceList from "./pages/dashboard/attendance/AttendanceList";
import AddExpense from "./pages/dashboard/expenses/AddExpense";
import ExpenseList from "./pages/dashboard/expenses/ExpenseList";
import AddExpenseCategory from "./pages/dashboard/expenses/AddExpenseCategory";
import ExpenseCategoryList from "./pages/dashboard/expenses/ExpenseCategoryList";
import AddAccount from "./pages/dashboard/accounting/AddAccount";
import AccountList from "./pages/dashboard/accounting/AccountList";
import AddTransaction from "./pages/dashboard/accounting/AddTransaction";
import TransactionList from "./pages/dashboard/accounting/TransactionList";
import BalanceSheet from "./pages/dashboard/accounting/BalanceSheet";
import TrialBalance from "./pages/dashboard/accounting/TrialBalance";
import AddSupplierPayment from "./pages/dashboard/payments/AddSupplierPayment";
import SupplierPaymentList from "./pages/dashboard/payments/SupplierPaymentList";
import AddCustomerReceive from "./pages/dashboard/payments/AddCustomerReceive";
import CustomerReceiveList from "./pages/dashboard/payments/CustomerReceiveList";
import AddPayroll from "./pages/dashboard/payroll/AddPayroll";
import PayrollList from "./pages/dashboard/payroll/PayrollList";
import AddRMCategory from "./pages/dashboard/item-setup/AddRMCategory";
import RMCategoryList from "./pages/dashboard/item-setup/RMCategoryList";
import AddRawMaterial from "./pages/dashboard/item-setup/AddRawMaterial";
import RawMaterialList from "./pages/dashboard/item-setup/RawMaterialList";
import AddProductCategory from "./pages/dashboard/item-setup/AddProductCategory";
import ProductCategoryList from "./pages/dashboard/item-setup/ProductCategoryList";
import AddProduct from "./pages/dashboard/item-setup/AddProduct";
import ProductList from "./pages/dashboard/item-setup/ProductList";
import AddNonInventoryItem from "./pages/dashboard/item-setup/non-inventory/AddNonInventoryItem";
import NonInventoryItemList from "./pages/dashboard/item-setup/non-inventory/NonInventoryItemList";
import BackupRestore from "./pages/dashboard/settings/BackupRestore";
import ProductStock from "./pages/dashboard/stock/ProductStock";
import RawMaterialStock from "./pages/dashboard/stock/RawMaterialStock";
import AddQuotation from "./pages/dashboard/quotations/AddQuotation";
import QuotationList from "./pages/dashboard/quotations/QuotationList";
import AddRole from "./pages/dashboard/users/AddRole";
import RoleList from "./pages/dashboard/users/RoleList";
import AddUser from "./pages/dashboard/users/AddUser";
import UserList from "./pages/dashboard/users/UserList";
import AddRMWaste from "./pages/dashboard/wastes/AddRMWaste";
import RMWasteList from "./pages/dashboard/wastes/RMWasteList";
import AddProductWaste from "./pages/dashboard/wastes/AddProductWaste";
import ProductWasteList from "./pages/dashboard/wastes/ProductWasteList";
import CompanyProfile from "./pages/dashboard/settings/CompanyProfile";
import AddUnit from "./pages/dashboard/settings/AddUnit";
import UnitList from "./pages/dashboard/settings/UnitList";
import AddCurrency from "./pages/dashboard/settings/AddCurrency";
import CurrencyList from "./pages/dashboard/settings/CurrencyList";
import AddProductionStage from "./pages/dashboard/settings/AddProductionStage";
import ProductionStageList from "./pages/dashboard/settings/ProductionStageList";
import SaleReport from "./pages/dashboard/reports/SaleReport";
import PurchaseReport from "./pages/dashboard/reports/PurchaseReport";
import ProfitLossReport from "./pages/dashboard/reports/ProfitLossReport";
import ProductionReport from "./pages/dashboard/reports/ProductionReport";
import ExpenseReport from "./pages/dashboard/reports/ExpenseReport";
import ProductPriceHistory from "./pages/dashboard/reports/ProductPriceHistory";
import RawMaterialPriceHistory from "./pages/dashboard/reports/RawMaterialPriceHistory";
import RMPurchaseReport from "./pages/dashboard/reports/RMPurchaseReport";
import RMItemWisePurchaseReport from "./pages/dashboard/reports/RMItemWisePurchaseReport";
import RMStockReport from "./pages/dashboard/reports/RMStockReport";
import SupplierDueReport from "./pages/dashboard/reports/SupplierDueReport";
import SupplierBalanceReport from "./pages/dashboard/reports/SupplierBalanceReport";
import SupplierLedger from "./pages/dashboard/reports/SupplierLedger";
import ProductProductionReport from "./pages/dashboard/reports/ProductProductionReport";
import ItemWiseSaleReport from "./pages/dashboard/reports/ItemWiseSaleReport";
import CustomerDueReport from "./pages/dashboard/reports/CustomerDueReport";
import CustomerLedger from "./pages/dashboard/reports/CustomerLedger";
import ProductProfitReport from "./pages/dashboard/reports/ProductProfitReport";
import TaxSettings from "./pages/dashboard/settings/TaxSettings";
import WhiteLabel from "./pages/dashboard/settings/WhiteLabel";
import EmailSettings from "./pages/dashboard/settings/EmailSettings";
import DataImport from "./pages/dashboard/settings/DataImport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-muted-foreground">This page is under development.</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            
            {/* Outlets */}
            <Route path="outlets" element={<Navigate to="/dashboard/outlets/list" replace />} />
            <Route path="outlets/add" element={<AddOutlet />} />
            <Route path="outlets/list" element={<OutletsList />} />
            
            {/* Production */}
            <Route path="production/add" element={<AddProduction />} />
            <Route path="production/list" element={<ProductionList />} />
            <Route path="production/add-loss" element={<AddProductionLoss />} />
            <Route path="production/loss-list" element={<ProductionLossList />} />
            <Route path="production/forecast-order" element={<DemandForecastingByOrder />} />
            <Route path="production/forecast-product" element={<DemandForecastingByProduct />} />
            
            {/* Sales */}
            <Route path="sales/add" element={<AddSale />} />
            <Route path="sales/list" element={<SaleList />} />
            
            {/* Purchases */}
            <Route path="purchases/add" element={<AddPurchase />} />
            <Route path="purchases/list" element={<PurchaseList />} />
            
            {/* Parties */}
            <Route path="parties/add-customer" element={<AddCustomer />} />
            <Route path="parties/customers" element={<CustomerList />} />
            <Route path="parties/add-supplier" element={<AddSupplier />} />
            <Route path="parties/suppliers" element={<SupplierList />} />
            
            {/* Stock */}
            <Route path="stock" element={<ProductStock />} />
            
            {/* Orders */}
            <Route path="orders" element={<Navigate to="/dashboard/orders/list" replace />} />
            <Route path="orders/add" element={<AddOrder />} />
            <Route path="orders/list" element={<OrderList />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            
            {/* RM Stock */}
            <Route path="rm-stock" element={<RawMaterialStock />} />
            <Route path="rm-stock/low-stock" element={<RawMaterialStock />} />
            <Route path="rm-stock/add-adjustment" element={<RawMaterialStock />} />
            <Route path="rm-stock/adjustments" element={<RawMaterialStock />} />
            
            {/* Attendance */}
            <Route path="attendance/add" element={<AddAttendance />} />
            <Route path="attendance/list" element={<AttendanceList />} />
            
            {/* Expenses */}
            <Route path="expenses/add" element={<AddExpense />} />
            <Route path="expenses/list" element={<ExpenseList />} />
            <Route path="expenses/add-category" element={<AddExpenseCategory />} />
            <Route path="expenses/categories" element={<ExpenseCategoryList />} />
            
            {/* Accounting */}
            <Route path="accounting/add-account" element={<AddAccount />} />
            <Route path="accounting/accounts" element={<AccountList />} />
            <Route path="accounting/add-transaction" element={<AddTransaction />} />
            <Route path="accounting/transactions" element={<TransactionList />} />
            <Route path="accounting/balance-sheet" element={<BalanceSheet />} />
            <Route path="accounting/trial-balance" element={<TrialBalance />} />
            
            {/* Payments */}
            <Route path="supplier-payments/add" element={<AddSupplierPayment />} />
            <Route path="supplier-payments/list" element={<SupplierPaymentList />} />
            <Route path="customer-receives/add" element={<AddCustomerReceive />} />
            <Route path="customer-receives/list" element={<CustomerReceiveList />} />
            
            {/* Payroll */}
            <Route path="payroll/add" element={<AddPayroll />} />
            <Route path="payroll/list" element={<PayrollList />} />
            
            {/* Item Setup */}
            <Route path="item-setup/add-rm-category" element={<AddRMCategory />} />
            <Route path="item-setup/rm-categories" element={<RMCategoryList />} />
            <Route path="item-setup/add-raw-material" element={<AddRawMaterial />} />
            <Route path="item-setup/raw-materials" element={<RawMaterialList />} />
            <Route path="item-setup/non-inventory/add" element={<AddNonInventoryItem />} />
            <Route path="item-setup/non-inventory/list" element={<NonInventoryItemList />} />
            <Route path="item-setup/add-product-category" element={<AddProductCategory />} />
            <Route path="item-setup/product-categories" element={<ProductCategoryList />} />
            <Route path="item-setup/add-product" element={<AddProduct />} />
            <Route path="item-setup/products" element={<ProductList />} />
            
            {/* Wastes */}
            <Route path="rm-wastes/add" element={<AddRMWaste />} />
            <Route path="rm-wastes/list" element={<RMWasteList />} />
            <Route path="product-wastes/add" element={<AddProductWaste />} />
            <Route path="product-wastes/list" element={<ProductWasteList />} />
            
            {/* Quotations */}
            <Route path="quotations/add" element={<AddQuotation />} />
            <Route path="quotations/list" element={<QuotationList />} />
            
            {/* Reports */}
            <Route path="reports/sale" element={<SaleReport />} />
            <Route path="reports/purchase" element={<PurchaseReport />} />
            <Route path="reports/profit-loss" element={<ProfitLossReport />} />
            <Route path="reports/production" element={<ProductionReport />} />
            <Route path="reports/expense" element={<ExpenseReport />} />
            <Route path="reports/product-price-history" element={<ProductPriceHistory />} />
            <Route path="reports/rm-price-history" element={<RawMaterialPriceHistory />} />
            <Route path="reports/rm-purchase" element={<RMPurchaseReport />} />
            <Route path="reports/rm-item-purchase" element={<RMItemWisePurchaseReport />} />
            <Route path="reports/rm-stock" element={<RMStockReport />} />
            <Route path="reports/supplier-due" element={<SupplierDueReport />} />
            <Route path="reports/supplier-balance" element={<SupplierBalanceReport />} />
            <Route path="reports/supplier-ledger" element={<SupplierLedger />} />
            <Route path="reports/product-production" element={<ProductProductionReport />} />
            <Route path="reports/item-sale" element={<ItemWiseSaleReport />} />
            <Route path="reports/customer-due" element={<CustomerDueReport />} />
            <Route path="reports/customer-ledger" element={<CustomerLedger />} />
            <Route path="reports/product-profit" element={<ProductProfitReport />} />
            
            {/* Users */}
            <Route path="users/add-role" element={<AddRole />} />
            <Route path="users/roles" element={<RoleList />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="users/list" element={<UserList />} />
            
            {/* Settings */}
            <Route path="settings/company" element={<CompanyProfile />} />
            <Route path="settings/tax" element={<TaxSettings />} />
            <Route path="settings/white-label" element={<WhiteLabel />} />
            <Route path="settings/email" element={<EmailSettings />} />
            <Route path="settings/import" element={<DataImport />} />
            <Route path="settings/add-unit" element={<AddUnit />} />
            <Route path="settings/units" element={<UnitList />} />
            <Route path="settings/add-currency" element={<AddCurrency />} />
            <Route path="settings/currencies" element={<CurrencyList />} />
            <Route path="settings/add-stage" element={<AddProductionStage />} />
            <Route path="settings/stages" element={<ProductionStageList />} />
            
            {/* Backup */}
            <Route path="backup" element={<BackupRestore />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;