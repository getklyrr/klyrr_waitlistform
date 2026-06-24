import { MongoClient } from "mongodb";

async function fetchHackathons() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return [];
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("hackathon_platform");
    const rawData = await db.collection("listings").find({}).toArray();
    return rawData.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title || "Untitled Hackathon",
      url: doc.url || "#",
      prize_pool: doc.prize_pool || "See website",
    }));
  } catch (error) {
    return [];
  } finally {
    await client.close();
  }
}

export default async function HackathonsPage() {
  const hackathons = await fetchHackathons();
  return (
    <main className="w-full min-h-screen bg-[#fbf5ee] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-[#6b1a2a] text-5xl mb-4 font-serif">
          Active Teen <span className="text-[#c9993a] italic">Hackathons</span>
        </h1>
        <p className="text-[#6b1a2a]/70 mb-12">Hand-picked competitions for builders aged 13–18.</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((item) => (
            <div key={item.id} className="bg-white border border-[#6b1a2a]/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="inline-block bg-[#c9993a]/10 text-[#c9993a] text-xs px-3 py-1 rounded-full uppercase font-bold mb-4">
                  💰 {item.prize_pool}
                </div>
                <h3 className="text-2xl text-[#6b1a2a] font-bold mb-6 font-serif">{item.title}</h3>
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-[#6b1a2a] text-[#fbf5ee] text-sm font-bold py-3.5 rounded-xl">
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
