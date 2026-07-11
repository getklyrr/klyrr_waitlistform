import { NextResponse } from "next/server";
import { getCompetitionsCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const col = await getCompetitionsCollection();
    const items = await col
      .find({ published: true })
      .sort({ featured: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      items: items.map((doc) => ({ ...doc, id: doc._id.toString(), _id: undefined })),
    });
  } catch (err) {
    console.error("Public competitions fetch error:", err);
    return NextResponse.json({ items: [] });
  }
}
