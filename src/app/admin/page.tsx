import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CreditCard, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/auth/signin");
  }

  // Get system-wide statistics
  const [
    totalUsers,
    totalCenters,
    totalSubscriptions,
    activeSubscriptions,
    premiumCenters,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.dialysisCenter.count(),
    prisma.userSubscription.count(),
    prisma.userSubscription.count({
      where: { status: "ACTIVE" },
    }),
    prisma.dialysisCenter.count({
      where: { isPremium: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      where: { role: "BUSINESS_OWNER" },
    }),
  ]);

  const stats = {
    totalUsers,
    totalCenters,
    totalSubscriptions,
    activeSubscriptions,
    premiumCenters,
    conversionRate: totalUsers > 0 ? ((activeSubscriptions / totalUsers) * 100).toFixed(1) : "0",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          System overview and management for the dialysis center platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered business owners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Centers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCenters}</div>
            <p className="text-xs text-muted-foreground">
              {stats.premiumCenters} premium centers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats.totalSubscriptions} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Users with active subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Recently registered business owners
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <div className="text-center py-4">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No users registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/users"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-gray-600">Create and manage business owner accounts</p>
                  </div>
                </div>
              </a>
              
              <a
                href="/admin/centers"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Manage Centers</p>
                    <p className="text-sm text-gray-600">View and assign dialysis centers</p>
                  </div>
                </div>
              </a>
              
              <a
                href="/admin/pricing"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Pricing Settings</p>
                    <p className="text-sm text-gray-600">Configure subscription pricing</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}