import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Phone, Mail, Globe, Edit } from "lucide-react";
import Link from "next/link";

export default async function DashboardCentersPage() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!["SUPER_ADMIN", "BUSINESS_OWNER"].includes(session.user.role)) {
    redirect("/auth/signin");
  }

  // Get user's owned centers
  const ownedCenters = await prisma.centerOwnership.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    include: {
      dialysisCenter: {
        include: {
          state: true,
          images: {
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
          },
          analytics: {
            where: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          },
        },
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Centers</h1>
          <p className="text-gray-600">
            Manage your dialysis centers and their information
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Centers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownedCenters.length}</div>
            <p className="text-xs text-muted-foreground">
              Under your management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Centers</CardTitle>
            <Badge className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ownedCenters.filter(o => o.dialysisCenter.isPremium).length}
            </div>
            <p className="text-xs text-muted-foreground">
              With premium features
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ownedCenters.reduce((acc, ownership) => 
                acc + ownership.dialysisCenter.analytics.reduce((sum, a) => sum + a.views, 0), 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Centers List */}
      <div className="space-y-6">
        {ownedCenters.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No centers assigned
              </h3>
              <p className="text-gray-600 mb-4">
                Contact your administrator to get dialysis centers assigned to your account.
              </p>
            </CardContent>
          </Card>
        ) : (
          ownedCenters.map((ownership) => {
            const center = ownership.dialysisCenter;
            const totalViews = center.analytics.reduce((sum, a) => sum + a.views, 0);
            const totalInteractions = center.analytics.reduce((sum, a) => 
              sum + a.phoneClicks + a.whatsappClicks + a.emailClicks + a.websiteClicks, 0
            );

            return (
              <Card key={ownership.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {center.dialysisCenterName}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {center.address}, {center.state.name}
                        </span>
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-3">
                        {center.isPremium && (
                          <Badge variant="secondary">Premium</Badge>
                        )}
                        {center.featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                        <Badge variant="outline">{center.sector}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/centers/${center.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        {center.phoneNumber && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{center.phoneNumber}</span>
                          </div>
                        )}
                        {center.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{center.email}</span>
                          </div>
                        )}
                        {center.website && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="truncate">{center.website}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Analytics Summary */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Recent Performance</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{totalViews}</div>
                          <div className="text-xs text-gray-600">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{totalInteractions}</div>
                          <div className="text-xs text-gray-600">Interactions</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {center.drInCharge && (
                        <div>
                          <span className="font-medium text-gray-600">Dr. in Charge:</span>
                          <p className="text-gray-900">{center.drInCharge}</p>
                        </div>
                      )}
                      {center.units && (
                        <div>
                          <span className="font-medium text-gray-600">Units:</span>
                          <p className="text-gray-900">{center.units}</p>
                        </div>
                      )}
                      {center.images.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-600">Images:</span>
                          <p className="text-gray-900">{center.images.length} photos</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}