export default function Beat({ beat }: { beat: { id: string; title: string; artist: string; genre: string; bpm: number } }) {
  
    return (
    <div className="flex gap-6 items-center bg-zinc-800 p-4 rounded-lg">
      <img
        src="https://via.placeholder.com/150"
        alt="Beat Cover"
        className="w-18 h-18 rounded-lg"
      />
      <div>
        <h2 className="text-xl font-bold">{beat.title}</h2>
        <p className="text-sm text-gray-400">Artists: {beat.artist}</p>
        <div className="flex flex-row gap-2">
          <p className="text-sm text-gray-400"><strong>Genre:</strong> {beat.genre}</p>
          <p className="text-sm text-gray-400"><strong>BPM:</strong> {beat.bpm}</p>
          <p className="text-sm text-gray-400"><strong>Key:</strong> A#</p>
        </div>
      </div>
    </div>
  );
}