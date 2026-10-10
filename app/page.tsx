import { Navbar } from "./components/ui/Navbar";
import { Footer } from "./components/ui/Footer";
import { CommercialExperience } from "./components/commercial/CommercialExperience";
import { getCommercialData } from "./lib/commercial-data";
export const revalidate = 60;
export default async function Home() {
  const data = await getCommercialData();
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <CommercialExperience {...data} hero />
      </main>
      <Footer />
    </>
  );
}
