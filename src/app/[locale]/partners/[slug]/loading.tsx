export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[96rem] animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-4 h-10 w-2/3 rounded bg-muted" />
      <div className="mt-4 h-5 w-full max-w-xl rounded bg-muted" />
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
