import Skeleton from "react-loading-skeleton";

// Avatar / Profile image skeleton
export const skeletonAvatar = (size = 90) => (
  <Skeleton circle width={size} height={size} />
);

// Heading skeleton (page title / product name)
export const skeletonHeading = (width = 250, height = 30) => (
  <Skeleton width={width} height={height} />
);

// Title skeleton (card title)
export const skeletonTitle = (width = 140, height = 25) => (
  <Skeleton width={width} height={height} />
);

// Single line text skeleton
export const skeletonLine = (width = "100%", height = 16) => (
  <Skeleton width={width} height={height} />
);

// Block skeleton (image / button / price area)
export const skeletonBlock = (width = "100%", height = 20) => (
  <Skeleton width={width} height={height} />
);

// Product card skeleton (Flipkart / Amazon style)
export const skeletonProductCard = () => (
  <div className="card p-3 h-100">
    <Skeleton height={190} className="mb-3" />
    <Skeleton height={18} width="80%" className="mb-2" />
    <Skeleton height={16} width="60%" className="mb-2" />
    <Skeleton height={36} width="100%" />
  </div>
);

// Generic multi-line skeleton (description / content)
export const skeletonCard = (
  lines = 4,
  width = "100%",
  lineHeight = 14
) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} width={width} height={lineHeight} />
    ))}
  </div>
);
