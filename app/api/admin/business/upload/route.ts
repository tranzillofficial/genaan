import { NextRequest, NextResponse } from "next/server";
import { commercialAdmin } from "../../../../lib/commercial-admin";
export async function POST(req: NextRequest) {
  const admin = await commercialAdmin(req);
  if (!admin.client)
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const form = await req.formData();
    const file = form.get("file");
    const isPlant = form.get("target") === "plants";
    const maxSize = isPlant ? 4194304 : 5242880;
    if (
      !(file instanceof File) ||
      !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
        file.type,
      ) ||
      file.size > maxSize ||
      file.size === 0
    )
      return NextResponse.json(
        { error: `Use an image under ${isPlant ? 4 : 5} MB.` },
        { status: 400 },
      );
    const ext: { [key: string]: string } = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    };
    const folder = isPlant ? "plants" : "packages";
    const path = `${folder}/${crypto.randomUUID()}.${ext[file.type]}`;
    const { error } = await admin.client.storage
      .from("genaan-packages")
      .upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });
    if (error)
      return NextResponse.json(
        { error: "Could not upload the image." },
        { status: 500 },
      );
    const { data } = admin.client.storage
      .from("genaan-packages")
      .getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 400 });
  }
}
