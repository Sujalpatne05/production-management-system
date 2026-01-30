import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart3,
  Shield,
  LogOut,
  User,
  Lock,
  ArrowLeft,
  Edit2,
} from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [userInfo] = useState<UserInfo>({
    name: "Admin",
    email: "admin@doorsoft.co",
    phone: "+8801812391633",
    role: "Administrator",
    joinDate: "January 15, 2024",
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-purple-600 text-white text-2xl">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                <p className="text-sm text-muted-foreground">{userInfo.role}</p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{userInfo.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{userInfo.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{userInfo.joinDate}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => navigate("/dashboard/change-profile")}
                >
                  <Edit2 className="w-4 h-4" />
                  Change Profile
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => navigate("/dashboard/change-password")}
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => navigate("/dashboard/security-question")}
                >
                  <Shield className="w-4 h-4" />
                  Security Question
                </Button>
                <Button
                  className="w-full gap-2 text-red-600 hover:text-red-700"
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & Stats */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <p className="text-sm text-muted-foreground mt-2">Running Productions</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">48</div>
                  <p className="text-sm text-muted-foreground mt-2">Completed Orders</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">156</div>
                  <p className="text-sm text-muted-foreground mt-2">Total Transactions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Account Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="font-medium">Last Login</p>
                  <p className="text-sm text-muted-foreground">Today at 9:45 AM</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="font-medium">Password Changed</p>
                  <p className="text-sm text-muted-foreground">30 days ago</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Profile Updated</p>
                  <p className="text-sm text-muted-foreground">90 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Enhance your account security</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Login Sessions</p>
                    <p className="text-xs text-muted-foreground">View active sessions</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
