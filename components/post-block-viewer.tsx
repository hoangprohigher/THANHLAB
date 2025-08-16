import React from "react";
import { PostBlock } from "./post-block-editor";

export function PostBlockViewer({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        if (block.type === "text") {
          return <p key={idx} className="text-base text-gray-800 whitespace-pre-line">{block.content}</p>;
        }
        if (block.type === "code") {
          return <pre key={idx} className="bg-gray-900 text-green-200 rounded p-4 overflow-x-auto"><code>{block.content}</code></pre>;
        }
        if (block.type === "image") {
          return (
            <div key={idx} className="w-full flex justify-center">
              <img src={block.content} alt="block-img" className="max-w-full rounded shadow" />
            </div>
          );
        }
        if (block.type === "video") {
          // Check if YouTube link
          const ytMatch = block.content.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (ytMatch) {
            const videoId = ytMatch[1];
            return (
              <div key={idx} className="w-full flex justify-center">
                <iframe
                  width="640"
                  height="360"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded shadow"
                />
              </div>
            );
          }
          // Default: mp4 or other direct video link
          return (
            <div key={idx} className="w-full flex justify-center">
              <video
                src={block.content}
                controls
                style={{ width: "100%", maxWidth: "640px", height: "auto", background: "#000" }}
                preload="metadata"
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
