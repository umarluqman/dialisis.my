import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Building2, CreditCard, Calendar } from "lucide-react";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { AssignCentersDialog } from "@/components/admin/assign-centers-dialog";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/auth/signin");
  }

  // Get all business owner users
  const users = await prisma.user.findMany({
    where: {
      role: "BUSINESS_OWNER",
    },
    include: {
      ownedCenters: {
        include: {
          dialysisCenter: true,
        },
      },
      subscriptions: {
        where: {
          status: "ACTIVE",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get available centers for assignment
  const availableCenters = await prisma.dialysisCenter.findMany({
    select: {
      id: true,
      dialysisCenterName: true,
      address: true,
      state: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      dialysisCenterName: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage business owner accounts and center assignments
          </p>
        </div>
        <CreateUserDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Business owner accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.subscriptions.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with paid plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Centers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((acc, user) => acc + user.ownedCenters.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total center assignments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Business Owners</CardTitle>
          <CardDescription>
            Manage user accounts and their center assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users created yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first business owner account to get started.
              </p>
              <CreateUserDialog />
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">
                            {user.ownedCenters.length} centers
                          </Badge>
                          {user.subscriptions.length > 0 && (
                            <Badge variant="secondary">
                              {user.subscriptions[0].tier}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {user.ownedCenters.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Assigned Centers:</p>
                        <div className="flex flex-wrap gap-1">
                          {user.ownedCenters.slice(0, 3).map((ownership) => (
                            <Badge key={ownership.id} variant="outline" className="text-xs">
                              {ownership.dialysisCenter.dialysisCenterName}
                            </Badge>
                          ))}
                          {user.ownedCenters.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.ownedCenters.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <AssignCentersDialog 
                      user={user} 
                      availableCenters={availableCenters}
                      currentAssignments={user.ownedCenters.map(o => o.dialysisCenterId)}
                    />
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