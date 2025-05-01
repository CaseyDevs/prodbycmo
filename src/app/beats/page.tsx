import NavBar from "../components/NavBar/NavBar";
import Beat from "../components/Beats/Beat";

import { prisma } from "@/lib/prisma";

export default async function Beats() {
  
  const beats = await prisma.beat.findMany({
    include: {
      artists: true,
    },
  });

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col p-24">
        <h1 className="text-4xl text-center font-bold">Beats</h1>
        <h3 className="text-left mt-15 pb-4">Recent</h3>

        <div className="space-y-6">
          {beats.map((beat) => (
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
                url: beat.url,
              }}
            />
          ))}
        </div>
      </main>
    </>
  );
}
