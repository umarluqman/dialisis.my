import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useSearchParams } from "next/navigation";

interface DialysisCenterListingProps {
  state?: string;
  district?: string;
}

export function DialysisCenterListing({
  state,
  district,
}: DialysisCenterListingProps) {
  const searchParams = useSearchParams();

  // TODO: Fetch dialysis centers based on state and district
  // TODO: Implement filtering and sorting logic

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">
        Dialysis Centers
        {state && ` in ${state}`}
        {district && `, ${district}`}
      </h1>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search dialysis centers"
          className="mb-2"
        />
        <Select>
          <option value="">Filter by type</option>
          {/* Add options for dialysis center types */}
        </Select>
      </div>

      <div className="mb-4">
        <Button>Sort by</Button>
      </div>

      {/* TODO: Add dialysis center list items here */}

      {/* TODO: Add pagination component */}
    </div>
  );
}
