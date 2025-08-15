"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface State {
  id: string;
  name: string;
}

export default function NewCenterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [formData, setFormData] = useState({
    dialysisCenterName: "",
    sector: "Private",
    drInCharge: "",
    address: "",
    addressWithUnit: "",
    tel: "",
    fax: "",
    panelNephrologist: "",
    centreManager: "",
    centreCoordinator: "",
    email: "",
    hepatitisBay: "",
    longitude: "",
    latitude: "",
    phoneNumber: "",
    website: "",
    title: "",
    units: "",
    stateId: "",
    town: "",
  });

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch("/api/states");
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dialysisCenterName) {
      toast.error("Center name is required");
      return;
    }
    
    if (!formData.stateId) {
      toast.error("Please select a state");
      return;
    }
    
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        fax: formData.fax || null,
        panelNephrologist: formData.panelNephrologist || null,
        centreManager: formData.centreManager || null,
        centreCoordinator: formData.centreCoordinator || null,
        email: formData.email || null,
        hepatitisBay: formData.hepatitisBay || null,
        website: formData.website || null,
      };

      const response = await fetch("/api/centers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create center");
      }

      toast.success("Dialysis center created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create center");
      console.error("Error creating center:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Dialysis Center</CardTitle>
            <CardDescription>
              Fill in the details to add a new dialysis center to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dialysisCenterName">Center Name *</Label>
                    <input
                      id="dialysisCenterName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.dialysisCenterName}
                      onChange={(e) => setFormData({ ...formData, dialysisCenterName: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(value) => setFormData({ ...formData, sector: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="NGO">NGO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateId">State *</Label>
                    <Select
                      value={formData.stateId}
                      onValueChange={(value) => setFormData({ ...formData, stateId: value })}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="town">Town/City</Label>
                    <input
                      id="town"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.town}
                      onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tel">Telephone</Label>
                    <input
                      id="tel"
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.tel}
                      onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fax">Fax</Label>
                    <input
                      id="fax"
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.fax}
                      onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <input
                      id="website"
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Address</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <input
                      id="address"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressWithUnit">Full Address with Unit</Label>
                    <textarea
                      id="addressWithUnit"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.addressWithUnit}
                      onChange={(e) => setFormData({ ...formData, addressWithUnit: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Location Coordinates (Optional) */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Location Coordinates (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Staff Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="drInCharge">Doctor In Charge</Label>
                    <input
                      id="drInCharge"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.drInCharge}
                      onChange={(e) => setFormData({ ...formData, drInCharge: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panelNephrologist">Panel Nephrologist</Label>
                    <input
                      id="panelNephrologist"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.panelNephrologist}
                      onChange={(e) => setFormData({ ...formData, panelNephrologist: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="centreManager">Centre Manager</Label>
                    <input
                      id="centreManager"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.centreManager}
                      onChange={(e) => setFormData({ ...formData, centreManager: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="centreCoordinator">Centre Coordinator</Label>
                    <input
                      id="centreCoordinator"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.centreCoordinator}
                      onChange={(e) => setFormData({ ...formData, centreCoordinator: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Facilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units">Units (comma-separated)</Label>
                    <input
                      id="units"
                      type="text"
                      placeholder="e.g., HD Unit, CAPD Unit"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.units}
                      onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hepatitisBay">Hepatitis Bay</Label>
                    <input
                      id="hepatitisBay"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.hepatitisBay}
                      onChange={(e) => setFormData({ ...formData, hepatitisBay: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/dashboard">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Center"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
}