import NavBar from "../components/NavBar/NavBar";
import Beat from "../components/Beats/Beat";

export default function Beats() {
  return (
    <>
    <NavBar />
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-4xl text-center font-bold">Beats</h1>
      <h3 className="text-left mt-15 pb-4">Recent</h3>
      <Beat beat={{ id: "1", title: "Beat Title", artist: "Artist Name", genre: "Genre", bpm: 120 }} />
    </main>
    </>
  );
}