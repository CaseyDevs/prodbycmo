import NavBar from "../components/NavBar/NavBar";
import Beat from "../components/Beats/Beat";
import { getBeats } from "@/lib/queries";

export default async function Beats() {

  const beats = await getBeats();

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col p-24">
        <h1 className="text-4xl text-center font-bold">Beats</h1>

        <div className="space-y-6">
          <h3 className="text-left mt-15 pb-4">Recent</h3>
          {beats && beats.length > 0 ? beats.map((beat) => (
            <>
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
            </>
          )) : (
            <p className="flex justify-center items-center text-gray-500 min-h-50">No beats available</p>
          )}
        </div>
      </main>
    </>
  );
}
