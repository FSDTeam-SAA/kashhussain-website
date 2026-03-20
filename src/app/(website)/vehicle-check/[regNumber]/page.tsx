import PricingSection from "./_components/pricing-plans";
import VehicleCheckDetails from "./_components/VehicleCheckDetails";

type PageProps = {
  params: {
    regNumber: string;
  };
};

export default function VehicleCheckPage({ params }: PageProps) {
  const regNumber = decodeURIComponent(params.regNumber);

  return (
    <div>
      <VehicleCheckDetails regNumber={regNumber} />
      <PricingSection />
    </div>
  );
}