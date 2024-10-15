import FilterLayout from "@/components/filter-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dialysis Centers",
  description: "Find the best dialysis centers near you",
};

export default function StateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { state: string };
}) {
  console.log("state", params.state);
  return (
    <FilterLayout params={{ state: params.state }}>{children}</FilterLayout>
  );
}
