export const dynamic = "force-dynamic";

import NavBar from "./components/NavBar/NavBar";
import Beat from "./components/Beats/Beat";
import Link from "next/link";
import { getFeaturedBeats } from "@/lib/queries";

export default async function Home() {

  const featuredBeats = await getFeaturedBeats();

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center p-24">
        {/* SEARCH BAR HERE */}
        <h1 className="text-2xl font-bold text-center">Featured: </h1>
        <div className="flex flex-col items-center">
          <div className="space-y-6 my-6">
            {featuredBeats.map((beat) => (
              <Beat
                key={beat.id}
                beat={{
                  id: beat.id.toString(),
                  title: beat.title,
                  artist: beat.artists.map((a) => a.name).join(", "),
                  genre: beat.genre,
                  bpm: beat.bpm,
                  key: beat.key,
                  coverImg: beat.coverImg,
                  url: `/api/proxy-beat?url=${encodeURIComponent(beat.url)}`,
                }}
              />
            ))}
          </div>
          <p>Search through my entire catalog <Link href={"/beats"} className="text-blue-400 hover:opacity-80 transition-colors">here...</Link></p>
        </div>
      </main>
    </>
  );
}
