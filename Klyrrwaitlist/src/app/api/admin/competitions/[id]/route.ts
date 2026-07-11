import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isAuthedRequest } from "@/lib/auth";
import { getCompetitionsCollection } from "@/lib/mongodb";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  const update: Record<string, unknown> = {};
  const allowedFields = [
    "name", "organizer", "category", "deadline", "eventDate", "prize",
    "level", "mode", "teamSize", "location", "description", "tags",
    "global", "featured", "url", "published",
  ];
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field];
  }

  const col = await getCompetitionsCollection();
  await col.updateOne({ _id: new ObjectId(id) }, { $set: update });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const col = await getCompetitionsCollection();
  await col.deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ ok: true });
}
