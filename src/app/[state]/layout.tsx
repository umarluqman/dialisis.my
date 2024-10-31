import FilterLayout from "@/components/filter-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pusat Dialisis",
  description: "Cari pusat dialisis yang berdekatan dengan anda",
};

export default function StateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FilterLayout>{children}</FilterLayout>;
}
