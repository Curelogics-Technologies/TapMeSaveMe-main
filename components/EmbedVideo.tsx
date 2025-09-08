"use client";

import React from "react";

interface VideoEmbedProps {
    url: string;
    rounded?: boolean;
}

const getEmbedUrl = (url: string): string => {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("drive.google.com")) {
            const match = parsedUrl.pathname.match(/\/d\/([^/]+)/);
            if (match) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
        }

        if (parsedUrl.hostname.includes("youtube.com")) {
            const videoId = parsedUrl.searchParams.get("v");
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        if (parsedUrl.hostname.includes("youtu.be")) {
            const videoId = parsedUrl.pathname.replace("/", "");
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        return url; // fallback (if unrecognized)
    } catch {
        return url; // if invalid URL
    }
};

const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, rounded = true }) => {
    const src = getEmbedUrl(url);

    return (
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
                src={src}
                allow="autoplay; encrypted-media; picture-in-picture"
                className={`absolute top-0 left-0 w-full h-full shadow-md ${rounded ? "rounded-lg" : ""
                    }`}
                frameBorder="0"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default VideoEmbed;