"use client";

import NavBar from "./components/NavBar/NavBar";
import Beat from "./components/Beat/Beat";

export default function Home() {
  
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-2xl font-bold text-center">Featured: </h1>
      </main>
    </>
  );
}
