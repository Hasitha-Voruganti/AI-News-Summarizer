import React from 'react';

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-48 rounded-t-2xl rounded-b-none" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-20 rounded-full" />
      <div className="space-y-2">
        <div className="skeleton h-4 rounded-lg" />
        <div className="skeleton h-4 w-5/6 rounded-lg" />
      </div>
      <div className="space-y-1.5">
        <div className="skeleton h-3 rounded-lg" />
        <div className="skeleton h-3 w-4/5 rounded-lg" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
