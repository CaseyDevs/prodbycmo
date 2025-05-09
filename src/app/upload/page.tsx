"use client";

import { useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      
      if (fileSizeInMB > 50) {
        alert("File size exceeds 50MB. Please select a smaller file.");
        setFile(null);
      }

    }
  }

  async function handleUpload() {
    if (!file || !title || !artist || !genre || !bpm) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("genre", genre);
    formData.append("bpm", bpm);
    formData.append("key", key);
    formData.append("coverImg", coverImg);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      }
    );

      // CARRY ON HERE
      // setIsUploading(true);
      // const reader = response.body?.getReader();
      // if (reader) {
      //   const contentLength = +response.headers.get("Content-Length")!;
      //   const total = contentLength || 0;
      //   let loaded = 0;
      //   while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) break;
      //     loaded += value.length;
      //     setUploadProgress(Math.round((loaded / total) * 100));
      //   }
      //   setIsUploading(false);
      // }

      if (response.ok && uploadProgress === 100) {
        alert("File uploaded successfully!");
      } else {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        alert("File upload failed. Check console for details.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("File upload failed due to a network error.");
    }
  }

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col p-8 md:p-24">
        <h1 className="text-4xl text-center font-bold mb-8">Upload Your Beats</h1>
        <form className="flex flex-col space-y-6 p-8 rounded-lg shadow-md min-w-lg mx-auto">
          <label
            htmlFor="files"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-orange-400 transition"
          >
            <FaCloudUploadAlt className="text-4xl text-orange-400 mb-2" />
            <span className="text-gray-600">Choose a beat to upload</span>
            <input
              name="files"
              type="file"
              accept="audio/*"
              id="files"
              className="hidden"
              onChange={handleFileChange}
              required
            />
          </label>
          {file && (
            <div className="text-center">
              <p className="text-lg font-semibold">{file.name}</p>
              <p className="text-gray-500">
                {Math.round(file.size / 1024)} KB
              </p>
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
          />
          <input
            type="number"
            min={0}
            placeholder="BPM"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Cover Image URL (optional)"
            value={coverImg}
            onChange={(e) => setCoverImg(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Key (optional)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition"
            onClick={(e) => {
              e.preventDefault();
              handleUpload();
            }}
            disabled={isUploading}
          >
            Upload
          </button>
        </form>
      </main>
    </>
  );
}
