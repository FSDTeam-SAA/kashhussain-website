type RegistrationPlateProps = {
  value: string;
  className?: string;
};

export default function RegistrationPlate({
  value,
  className = "",
}: RegistrationPlateProps) {
  return (
    <div
      className={`flex h-[70px] w-full max-w-[420px] overflow-hidden rounded-md border-2 border-[#1A1A1A] bg-[#F6C433] ${className}`}
    >
      <div className="flex w-[62px] items-center justify-center bg-[#233B8E] text-2xl font-bold text-white">
        GB
      </div>
      <div className="flex flex-1 items-center justify-center px-4 text-4xl font-extrabold uppercase text-black">
        {value}
      </div>
    </div>
  );
}