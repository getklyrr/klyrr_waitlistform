import { NextRequest, NextResponse } from "next/server";
import { isAuthedRequest } from "@/lib/auth";
import { getCompetitionsCollection } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  if (!isAuthedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const col = await getCompetitionsCollection();
  const items = await col.find({}).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    items: items.map((doc) => ({ ...doc, id: doc._id.toString(), _id: undefined })),
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const doc = {
    name: body.name || "",
    organizer: body.organizer || "",
    category: body.category || "",
    deadline: body.deadline || "",
    eventDate: body.eventDate || "",
    prize: body.prize || "",
    level: body.level || "",
    mode: body.mode || "",
    teamSize: body.teamSize || "",
    location: body.location || "",
    description: body.description || "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    global: !!body.global,
    featured: !!body.featured,
    url: body.url || "",
    published: true,
    createdAt: new Date(),
  };

  const col = await getCompetitionsCollection();
  const result = await col.insertOne(doc);

  return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
}
