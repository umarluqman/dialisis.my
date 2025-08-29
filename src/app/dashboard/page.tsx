import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, BarChart3, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Get user's owned centers
  const ownedCenters = await prisma.centerOwnership.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    include: {
      dialysisCenter: true,
    },
  });

  // Get user's subscription info
  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  });

  const stats = {
    totalCenters: ownedCenters.length,
    premiumCenters: ownedCenters.filter(o => o.dialysisCenter.isPremium).length,
    subscriptionTier: subscription?.tier || "FREE",
    subscriptionStatus: subscription?.status || "INACTIVE",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back, {session.user.name}! Here's what's happening with your dialysis centers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Centers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCenters}</div>
            <p className="text-xs text-muted-foreground">
              Centers under your management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Centers</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premiumCenters}</div>
            <p className="text-xs text-muted-foreground">
              Centers with premium features
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscriptionTier}</div>
            <p className="text-xs text-muted-foreground">
              Current subscription plan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscriptionStatus}</div>
            <p className="text-xs text-muted-foreground">
              Account status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Centers */}
      <Card>
        <CardHeader>
          <CardTitle>Your Dialysis Centers</CardTitle>
          <CardDescription>
            Manage your dialysis centers and their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ownedCenters.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No centers assigned
              </h3>
              <p className="text-gray-600">
                Contact your administrator to get centers assigned to your account.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ownedCenters.map((ownership) => (
                <div
                  key={ownership.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {ownership.dialysisCenter.dialysisCenterName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {ownership.dialysisCenter.address}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {ownership.dialysisCenter.isPremium && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Premium
                        </span>
                      )}
                      {ownership.dialysisCenter.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}