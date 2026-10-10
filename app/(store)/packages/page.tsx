import { CommercialExperience } from "../../components/commercial/CommercialExperience";
import { getCommercialData } from "../../lib/commercial-data";
export const metadata = {
  title: "Business plant packages",
  description:
    "Explore plant packages for business spaces in Egypt. Choose a package or request a custom quote, and our team will call you to discuss the details.",
};
export const revalidate = 60;
export default async function PackagesPage() {
  return <CommercialExperience {...await getCommercialData()} />;
}
