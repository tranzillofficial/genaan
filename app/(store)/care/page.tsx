import { getCommercialData } from "../../lib/commercial-data";
import { CareExperience } from "../../components/commercial/CareExperience";
export const metadata = {
  title: "Annual plant care",
  description: "Optional annual care for your business plants. Choose two or four visits a year and discuss a plan for your space with Genaan.",
};
export default async function CarePage() {
  const { settings } = await getCommercialData();
  return <CareExperience settings={settings}/>;
}
