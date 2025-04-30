"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/songs", {
      method: "POST",
      body: JSON.stringify({ title, artist, url }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTitle(""); setArtist(""); setUrl("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="p-2 border rounded w-full"
      />
      <input
        value={artist}
        onChange={e => setArtist(e.target.value)}
        placeholder="Artist"
        className="p-2 border rounded w-full"
      />
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Audio URL"
        className="p-2 border rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload Song
      </button>
    </form>
  );
}
