"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="text-center py-8">
      <h1 className="text-2xl font-semibold">Error</h1>
      <p className="mt-4 text-gray-500">{error.message}</p>
    </div>
  );
}
