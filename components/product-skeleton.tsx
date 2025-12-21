import { Skeleton } from "./ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="relative bg-white rounded-md border border-stone-100 overflow-hidden">
      <div className="relative aspect-square rounded-t-md overflow-hidden mb-5 bg-stone-200 animate-pulse">
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Skeleton className="h-10 w-18 rounded-full" />
        </div>
        <Skeleton className="h-12 w-12 absolute top-4 right-4 px-1 md:px-2 py-2 md:py-5 rounded-full" />
      </div>

      {/* Content Area Skeleton */}
      <div className="px-4 pb-4 space-y-3 bg-white">    
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-8 w-2/3 rounded" />
          <Skeleton className="h-8 w-12 rounded" />
        </div>

        <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
