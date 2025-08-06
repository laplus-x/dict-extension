import {
  type HTMLAttributes
} from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const Skeleton = ({ lines = 8, className, ...props }: SkeletonProps) => {
  return (
    <div {...props} className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-5 bg-gray-300 rounded animate-pulse"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
};