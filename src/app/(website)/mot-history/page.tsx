import MotHistoryContainer from "./_components/mot-history-container";

type MotHistoryPageProps = {
  searchParams?: {
    registrationNumber?: string | string[];
  };
};

export default function MotHistoryPage({ searchParams }: MotHistoryPageProps) {
  const registrationNumber = Array.isArray(searchParams?.registrationNumber)
    ? searchParams?.registrationNumber[0]
    : searchParams?.registrationNumber;

  return <MotHistoryContainer initialRegistrationNumber={registrationNumber} />;
}
