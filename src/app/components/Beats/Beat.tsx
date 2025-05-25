"use client"

import { useRef } from "react";
import { useEffect } from "react";

const audioRefs: HTMLAudioElement[] = []; // Store references to all audio elements

export default function Beat({ beat }: { beat: { id: string; title: string; artist: string; genre: string; bpm: number; key: string, coverImg: string, url: string } }) {

	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		const audio = audioRef.current;  // Get the current audio element reference
		if (!audio) return;

		audioRefs.push(audio);

		const handlePlay = () => {
			audioRefs.forEach((otherAudio) => {
				if (otherAudio !== audio) {
					otherAudio.pause();
					otherAudio.currentTime = 0;
				}
			});
		};

		audio.addEventListener("play", handlePlay);

		// Cleanup function to remove the event listener and the audio reference
		return () => {
			audio.removeEventListener("play", handlePlay);
			const index = audioRefs.indexOf(audio);
			if (index !== -1) {
				audioRefs.splice(index, 1);
			}
		};
	}, []);


	return (
		<div className="flex gap-6 items-center bg-zinc-800 p-4 rounded-lg">
			<img
				src={beat.coverImg}
				alt="Beat Cover"
				className="w-18 h-18 rounded-lg"
			/>
			<div>
				<h2 className="text-xl font-bold">{beat.title}</h2>
				<p className="text-sm text-gray-400">Artists: {beat.artist}</p>
				<div className="flex flex-row gap-2">
					<p className="text-sm text-gray-400"><strong>Genre:</strong> {beat.genre}</p>
					<p className="text-sm text-gray-400"><strong>BPM:</strong> {beat.bpm}</p>
					<p className="text-sm text-gray-400"><strong>Key:</strong> {beat.key}</p>
					<audio
						ref={audioRef}
						controls
						preload="none"
						className="ml-4 h-8 [&::-webkit-media-controls-panel]:bg-zinc-700 [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white [&::-webkit-media-controls-timeline]:bg-zinc-600 [&::-webkit-media-controls-play-button]:text-white [&::-webkit-media-controls-timeline]:rounded-lg"
					>
						<source src={beat.url} />
						Your browser does not support the audio element.
					</audio>
				</div>
			</div>
		</div>
	);
}