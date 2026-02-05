export default function Loader() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div
        className="
          w-20 h-20
          rounded-full
          border-4 border-line
          border-t-cream
          animate-spin
        "
        aria-label="Loading"
      />
    </div>
  );
}