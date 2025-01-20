// app/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Featured Article Skeleton */}
        <div className="mb-12">
          <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg"></div>
          <div className="mt-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="mt-2 h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="mt-3 h-4 w-full bg-gray-200 rounded"></div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Article Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg"></div>
              <div className="mt-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="mt-2 h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="mt-2 h-4 w-full bg-gray-200 rounded"></div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
