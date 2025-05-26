"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar/NavBar";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { checkRole } from "@/utils/checkRole";

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
  const [fileSizeInMB, setFileSizeInMB] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  // Check if the user is an admin & redirect if not
  useEffect(() => {
    async function verify() {
      const role = await checkRole();
      if (role !== "ADMIN") {
        router.push("/");
      } else {
        setChecked(true);
      }
    }
    verify();
  }, []);

  if (!checked) {
    return null;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileSizeInMB(selectedFile.size / (1024 * 1024));

      if (fileSizeInMB > 50) {
        setError("File size exceeds 50MB. Please select a smaller file.");
        setFile(null);
      }
    }
  }

  async function handleUpload() {
    if (!file || !title || !artist || !genre || !bpm) {
      setError("Please fill in all required fields.");
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

    // start uploading
    setIsUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    // listen for progress events
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        alert("File uploaded successfully!");
        setIsUploading(false);
        cleanForm();
        // redirect to beats page
        redirect("/beats");
      } else {
        setError("File upload failed: " + xhr.responseText);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError("Network error. Please try again")
    };

    xhr.send(formData);
  }

  const cleanForm = () => {
    setFile(null);
    setTitle("");
    setArtist("");
    setGenre("");
    setBpm("");
    setKey("");
    setCoverImg("");
    setIsUploading(false);
    setUploadProgress(0);
    setFileSizeInMB(0);
  };

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
              disabled={isUploading}
              required
            />
          </label>
          {file && (
            <div className="text-center">
              <p className="text-lg font-semibold">{file.name}</p>
              <p className="text-gray-500">
                {fileSizeInMB.toFixed(2)} MB
              </p>
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
            disabled={isUploading}
          />
          <input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
            disabled={isUploading}
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
            disabled={isUploading}
          />
          <input
            type="number"
            min={0}
            placeholder="BPM"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
            disabled={isUploading}
          />
          <input
            type="text"
            placeholder="Cover Image URL (optional)"
            value={coverImg}
            onChange={(e) => setCoverImg(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
            disabled={isUploading}
          />
          <input
            type="text"
            placeholder="Key (optional)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="border border-gray-300 rounded p-3 focus:outline-none"
            disabled={isUploading}
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
          {isUploading && (
            <div className="mt-4">
              {uploadProgress != 100 ? <p className="text-gray-500">Loading: {uploadProgress}%</p> : <p className="text-gray-500">Please wait...</p>}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-orange-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                >
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-red-600">- {error}</p>}

        </form>
      </main>
    </>
  );
}
