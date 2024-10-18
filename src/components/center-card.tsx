import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailIcon, PhoneCallIcon } from "lucide-react";
import Link from "next/link";

interface CenterCardProps {
  id: string;
  name: string;
  address: string;
  tel: string;
  email: string;
  state: string;
  city: string;
}

export function CenterCard({
  id,
  name,
  address,
  tel,
  email,
  state,
  city,
}: CenterCardProps) {
  return (
    <Link
      href={`/${state}/${encodeURIComponent(city)}/${encodeURIComponent(name)}`}
    >
      <Card className="shadow-sm hover:border-primary transition-shadow">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-primary mb-4">{address}</p>
          <div className="flex gap-2 items-center">
            <PhoneCallIcon className="w-4 h-4" />
            <p className="text-primary">{tel}</p>
          </div>
          <div className="flex gap-2 items-center">
            <MailIcon className="w-4 h-4" />
            <p className="text-primary">{email}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
