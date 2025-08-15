import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Phone, Globe, Edit, Trash2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Get business owner data
  const businessOwner = await prisma.businessOwner.findUnique({
    where: { userId: session.user.id },
    include: {
      dialysisCenters: {
        include: {
          state: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  
  if (!businessOwner) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session.user.name || session.user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/centers/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Center
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <form action={async () => {
                "use server";
                const { signOut } = await import("@/lib/auth");
                await signOut({ redirectTo: "/" });
              }}>
                <Button type="submit" variant="ghost">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{businessOwner.dialysisCenters.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Business Name</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {businessOwner.businessName || "Not specified"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Centers List */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Dialysis Centers</h2>
            {businessOwner.dialysisCenters.length > 0 && (
              <Link href="/centers">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            )}
          </div>

          {businessOwner.dialysisCenters.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="mb-4">
                  <Plus className="mx-auto h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No centers yet</h3>
                <p className="text-gray-600 mb-6">
                  Get started by adding your first dialysis center
                </p>
                <Link href="/centers/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Center
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessOwner.dialysisCenters.map((center) => (
                <Card key={center.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {center.dialysisCenterName || "Unnamed Center"}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {center.state.name}
                        </CardDescription>
                      </div>
                      <Badge variant={center.sector === "Private" ? "default" : "secondary"}>
                        {center.sector}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {center.addressWithUnit && (
                      <div className="flex items-start space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600 line-clamp-2">
                          {center.addressWithUnit}
                        </span>
                      </div>
                    )}
                    {center.tel && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{center.tel}</span>
                      </div>
                    )}
                    {center.website && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a 
                          href={center.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {center.website}
                        </a>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2 pt-4">
                      <Link href={`/centers/edit/${center.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}