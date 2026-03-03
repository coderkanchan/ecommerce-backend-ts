export default function ProductSkeleton() {
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900 animate-pulse">
     
      <div className="h-64 bg-gray-800"></div>

      <div className="p-4 space-y-4">
        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
        <div className="h-6 bg-gray-800 rounded w-1/4"></div>
        <div className="h-10 bg-gray-800 rounded w-full mt-4"></div>
      </div>
    </div>
  );
}