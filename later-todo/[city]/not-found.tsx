import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-bold">Location Not Found</h2>
      <p>Could not find the requested dialysis center location.</p>
      <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
        Return Home
      </Link>
    </div>
  );
}
