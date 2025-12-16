export function CenterCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-[300px] rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
