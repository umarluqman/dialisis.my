"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Center {
  id: string;
  dialysisCenterName: string;
  address: string;
  state: {
    name: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AssignCentersDialogProps {
  user: User;
  availableCenters: Center[];
  currentAssignments: string[];
}

export function AssignCentersDialog({ 
  user, 
  availableCenters, 
  currentAssignments 
}: AssignCentersDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCenters, setSelectedCenters] = useState<string[]>(currentAssignments);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/assign-centers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ centerIds: selectedCenters }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign centers");
      }

      const result = await response.json();
      toast.success(`Successfully assigned ${selectedCenters.length} centers to ${user.name}`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error assigning centers:", error);
      toast.error(error instanceof Error ? error.message : "Failed to assign centers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCenterToggle = (centerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCenters(prev => [...prev, centerId]);
    } else {
      setSelectedCenters(prev => prev.filter(id => id !== centerId));
    }
  };

  const handleSelectAll = () => {
    setSelectedCenters(availableCenters.map(center => center.id));
  };

  const handleSelectNone = () => {
    setSelectedCenters([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Building2 className="h-4 w-4" />
          <span>Assign Centers</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Centers to {user.name}</DialogTitle>
          <DialogDescription>
            Select the dialysis centers that {user.name} can manage. They will have full access to edit and manage these centers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedCenters.length} of {availableCenters.length} centers selected
            </p>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isLoading}
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectNone}
                disabled={isLoading}
              >
                Select None
              </Button>
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-3">
            {availableCenters.map((center) => (
              <div key={center.id} className="flex items-start space-x-3">
                <Checkbox
                  id={center.id}
                  checked={selectedCenters.includes(center.id)}
                  onCheckedChange={(checked) => 
                    handleCenterToggle(center.id, checked as boolean)
                  }
                  disabled={isLoading}
                />
                <div className="flex-1 min-w-0">
                  <label 
                    htmlFor={center.id}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {center.dialysisCenterName}
                  </label>
                  <p className="text-xs text-gray-600 truncate">
                    {center.address}
                  </p>
                  <p className="text-xs text-gray-500">
                    {center.state.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Assigning..." : "Assign Centers"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}