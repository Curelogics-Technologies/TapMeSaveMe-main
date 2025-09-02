"use client";

import React from "react";

interface VideoEmbedProps {
    fileId: string;
    rounded?: boolean;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ fileId, rounded = true }) => {
    const src = `https://drive.google.com/file/d/${fileId}/preview`;

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