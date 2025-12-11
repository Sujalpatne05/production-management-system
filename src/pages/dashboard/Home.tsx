import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Key, ShieldQuestion, LogOut, Download, Search, ShoppingCart, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ProductionData {
  referenceNo: string;
  product: string;
  startDate: string;
  consumedTime: string;
  productionCost: string;
  salePrice: string;
}

const mockProductionData: ProductionData[] = [];

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "professional" | "enterprise" | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      price: "₹49",
      period: "/month",
      features: [
        "Up to 10 users",
        "Basic production tracking",
        "5 GB storage",
        "Email support",
        "Basic reports"
      ],
      popular: false
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: "₹99",
      period: "/month",
      features: [
        "Up to 50 users",
        "Advanced production management",
        "50 GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom branding"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: "₹299",
      period: "/month",
      features: [
        "Unlimited users",
        "Full ERP features",
        "Unlimited storage",
        "24/7 dedicated support",
        "API access",
        "Custom integrations",
        "On-premise deployment"
      ],
      popular: false
    }
  ];

  const handlePurchase = () => {
    if (!selectedPlan) {
      toast({
        title: "No plan selected",
        description: "Please select a plan to continue",
        variant: "destructive"
      });
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    toast({
      title: "Purchase Initiated",
      description: `Redirecting to checkout for ${plan?.name}...`,
    });

    // Simulate redirect to payment
    setTimeout(() => {
      setShowBuyDialog(false);
      setSelectedPlan(null);
    }, 2000);
  };

  const filteredData = mockProductionData.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <Alert className="bg-warning/10 border-warning">
        <AlertDescription className="text-warning-foreground">
          In demo mode you cannot delete any data.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile/Home</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  A
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">Admin</h3>
                <p className="text-sm text-muted-foreground">admin@doorsoft.co</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/change-profile")}
              >
                <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-info" />
                </div>
                Change Profile
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/change-password")}
              >
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Key className="w-4 h-4 text-success" />
                </div>
                Change Password
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/dashboard/security-question")}
              >
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                  <ShieldQuestion className="w-4 h-4 text-warning" />
                </div>
                Set Security Question
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3"
                onClick={() => navigate("/login")}
              >
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-destructive" />
                </div>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Running Productions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Running Productions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search Here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Consumed Time</TableHead>
                    <TableHead>Production Cost</TableHead>
                    <TableHead>Sale Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.referenceNo}>
                      <TableCell className="font-medium">{item.referenceNo}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell className="text-xs">{item.consumedTime}</TableCell>
                      <TableCell>{item.productionCost}</TableCell>
                      <TableCell>{item.salePrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          size="lg" 
          className="rounded-full shadow-lg gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          onClick={() => setShowBuyDialog(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          Upgrade Now
        </Button>
      </div>

      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
            <DialogDescription>
              Select the perfect plan for your business needs
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan === plan.id ? "ring-2 ring-primary" : ""
                } ${plan.popular ? "border-primary" : ""}`}
                onClick={() => setSelectedPlan(plan.id as any)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge className="bg-primary">Popular</Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!selectedPlan}
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Proceed to Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
