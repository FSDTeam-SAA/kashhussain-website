type SectionHeaderProps = {
  title?: string;
  description?: string;
  className?: string;
};

export default function SectionHeader({
  title = "Reach Out to Us for Support & Guidance",
  description = "Have questions or feedback? Reach out anytime. We're here to help you on your journey.",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`bg-[linear-gradient(135deg,_#EAF5FF_25%,_#CFE1FF_60.36%,_#C6CCDD_95.71%)] px-4 py-10 md:px-0 md:py-14 lg:py-20 ${className}`}
    >
      <h3 className="text-center text-3xl font-bold leading-normal text-[#1E3A8A] md:text-4xl lg:text-[40px]">
        {title}
      </h3>

      <p className="mx-auto w-full pt-2 text-center text-sm font-normal leading-normal text-[#6B7280] md:w-1/2 md:text-base">
        {description}
      </p>
    </div>
  );
}