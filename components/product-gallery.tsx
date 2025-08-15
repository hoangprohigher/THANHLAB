"use client";
import { useState } from "react";

export function ProductGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [zoomPos, setZoomPos] = useState<{x: number, y: number} | null>(null);
  if (!images || images.length === 0) return null;
  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={images[active]}
            alt={`product-img-${active}`}
            className="h-64 w-64 object-contain rounded border cursor-zoom-in transition hover:scale-105"
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="flex gap-2 mt-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`border rounded w-16 h-16 overflow-hidden p-0.5 ${active === idx ? "border-orange-500" : "border-gray-200"}`}
              onClick={() => setActive(idx)}
              type="button"
            >
              <img src={img} alt={`thumb-${idx}`} className="object-contain w-full h-full" />
            </button>
          ))}
        </div>
      </div>

      {/* Modal popup ảnh lớn + zoom */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowModal(false)}>
          <div className="relative bg-white rounded-lg shadow-lg p-4" style={{ minWidth: 400, minHeight: 400 }} onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={() => setShowModal(false)}>&times;</button>
            <div
              className="relative w-[400px] h-[400px] overflow-hidden flex items-center justify-center"
              onMouseMove={e => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setZoomPos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top
                });
              }}
              onMouseLeave={() => setZoomPos(null)}
            >
              <img
                src={images[active]}
                alt="zoom-img"
                className="absolute top-0 left-0"
                style={zoomPos ? {
                  width: "800px",
                  height: "800px",
                  objectFit: "cover",
                  transform: `translate(-${zoomPos.x * 2 - 200}px, -${zoomPos.y * 2 - 200}px)`
                } : {
                  width: "400px",
                  height: "400px",
                  objectFit: "contain"
                }}
              />
              {/* Khung kính lúp */}
              {zoomPos && (
                <div
                  className="absolute border-2 border-orange-500 rounded-full pointer-events-none"
                  style={{
                    left: zoomPos.x - 40,
                    top: zoomPos.y - 40,
                    width: 80,
                    height: 80
                  }}
                />
              )}
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`border rounded w-12 h-12 overflow-hidden p-0.5 ${active === idx ? "border-orange-500" : "border-gray-200"}`}
                  onClick={() => setActive(idx)}
                  type="button"
                >
                  <img src={img} alt={`thumb-modal-${idx}`} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
