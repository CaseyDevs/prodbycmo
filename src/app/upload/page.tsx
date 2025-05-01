import NavBar from "../components/NavBar/NavBar";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Upload() {
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
                        />
                    </label>
                    <input
                        type="text"
                        placeholder="Title"
                        className="border border-gray-300 rounded p-3 focus:outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Artist"
                        className="border border-gray-300 rounded p-3 focus:outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Genre"
                        className="border border-gray-300 rounded p-3 focus:outline-none"
                    />
                    <input
                        type="number"
                        min={0}
                        placeholder="BPM"
                        className="border border-gray-300 rounded p-3 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition"
                    >
                        Upload
                    </button>
                </form>
            </main>
        </>
    );
}