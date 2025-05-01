import NavBar from "../components/NavBar/NavBar";
import React from "react";

export default function Beats() {
  return (
    <>
    <NavBar />
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Beats</h1>
    </main>
    </>
  );
}