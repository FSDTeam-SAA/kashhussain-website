export default function MotHistorySkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[142px] animate-pulse rounded-[26px] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
          />
        ))}
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="h-8 w-64 animate-pulse rounded-full bg-[#E9EEF5]" />
        <div className="mt-8 space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[250px] animate-pulse rounded-[28px] bg-[#F8FAFC]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
