import NavBar from "../components/NavBar/NavBar";
import React from "react";

export default function Beats() {
  return (
    <>
    <NavBar />
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-4xl text-center font-bold">Beats</h1>
      <h3 className="text-left mt-15 pb-4">Recent</h3>
      <div className="flex flex-col gap-4 border-2 border-zinc-900 rounded-lg p-4">
        <div className="flex gap-6 items-center bg-zinc-800 p-4 rounded-lg">
          <img
            src="https://via.placeholder.com/150"
            alt="Beat Cover"
            className="w-18 h-18 rounded-lg"
          />  
          <div>
          <h2 className="text-xl font-bold">Autumn 97'</h2>
          <p className="text-sm text-gray-400">Artists: prodbycmo, prodbytrigg</p>
          <div className="flex flex-row gap-2">            
          <p className="text-sm text-gray-400"><strong>Genre:</strong> Hiphop</p>
          <p className="text-sm text-gray-400"><strong>BPM:</strong> 90</p>
          <p className="text-sm text-gray-400"><strong>Key:</strong> A#</p>
          </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}