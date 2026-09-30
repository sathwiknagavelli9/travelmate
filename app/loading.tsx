export default function Loading() {
  return (
    <div
      className="container section"
      aria-label="Loading TravelMate"
      role="status"
    >
      <div className="skeleton skeleton-title" />
      <div className="package-grid">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
      <span className="sr-only">Loading your next adventure…</span>
    </div>
  );
}
