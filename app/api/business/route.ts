import { getCommercialData } from "../../lib/commercial-data";
export async function GET() {
  return Response.json(await getCommercialData());
}
