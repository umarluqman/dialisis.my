"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash, Eye, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface DialysisCenter {
  id: string;
  dialysisCenterName: string;
  address: string;
  town: string;
  state: {
    name: string;
  };
  sector: string;
  userRole?: string;
}

interface DialysisCenterListProps {
  centers: DialysisCenter[];
}

export function DialysisCenterList({ centers }: DialysisCenterListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this dialysis center?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/dialysis-centers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete dialysis center");
      }
    } catch (error) {
      alert("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Your Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {centers.map((center) => (
            <TableRow key={center.id}>
              <TableCell className="font-medium">
                {center.dialysisCenterName}
              </TableCell>
              <TableCell>
                {center.town}, {center.state.name}
              </TableCell>
              <TableCell>
                <Badge variant={center.sector === "Private" ? "default" : "secondary"}>
                  {center.sector}
                </Badge>
              </TableCell>
              <TableCell>
                {center.userRole && (
                  <Badge variant="outline" className="capitalize">
                    {center.userRole.toLowerCase()}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      disabled={deletingId === center.id}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${center.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Public Page
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/dialysis-centers/${center.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/dialysis-centers/${center.id}/team`}>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Team
                      </Link>
                    </DropdownMenuItem>
                    {center.userRole === "OWNER" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(center.id)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}