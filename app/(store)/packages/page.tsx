import { CommercialExperience } from "../../components/commercial/CommercialExperience";
import { getCommercialData } from "../../lib/commercial-data";
export const metadata = {
  title: "Business plant packages",
  description:
    "Five plant packages for clinics, restaurants, hotels and supermarkets. Request a tailored quotation on WhatsApp.",
};
export const revalidate = 60;
export default async function PackagesPage() {
  return <CommercialExperience {...await getCommercialData()} />;
}
