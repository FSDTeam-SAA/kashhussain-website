import VehicleCheckDetails from "./_components/VehicleCheckDetails";


type PageProps = {
  params: Promise<{
    regNumber: string;
  }>;
};

export default async function VehicleCheckPage({ params }: PageProps) {
  const { regNumber } = await params;

  return <VehicleCheckDetails regNumber={decodeURIComponent(regNumber)} />;
}