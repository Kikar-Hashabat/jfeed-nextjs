// app/article/[slug]/loading.tsx
export default function ArticleLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-24 w-full bg-gray-200 rounded mb-6"></div>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg mb-8"></div>

        {/* Content */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
