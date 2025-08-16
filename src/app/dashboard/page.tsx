import { redirect } from "next/navigation";
import { getCurrentUser, getUserDialysisCenters } from "@/lib/authorization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { DialysisCenterList } from "@/components/dashboard/dialysis-center-list";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const dialysisCenters = await getUserDialysisCenters(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user.name || user.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Centers
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dialysisCenters.length}</div>
            <p className="text-xs text-muted-foreground">
              Dialysis centers you manage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Role
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user.role.toLowerCase()}</div>
            <p className="text-xs text-muted-foreground">
              Account type
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Actions
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href="/dashboard/dialysis-centers/new">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Center
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button size="sm" variant="outline">
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialysis Centers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Dialysis Centers</CardTitle>
              <CardDescription>
                Manage your dialysis centers and their information
              </CardDescription>
            </div>
            <Link href="/dashboard/dialysis-centers/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Center
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {dialysisCenters.length > 0 ? (
            <DialysisCenterList centers={dialysisCenters} />
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No dialysis centers yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first dialysis center
              </p>
              <Link href="/dashboard/dialysis-centers/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Center
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}