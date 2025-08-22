"use client";
import React from "react";

export function ServiceCard({ service }: { service: any }) {
  const [index, setIndex] = React.useState(0);
  const images = Array.isArray(service.images) ? service.images : [];
  React.useEffect(() => {
    if (images.length < 2) return;
    const timer = setTimeout(() => setIndex(i => (i + 1) % images.length), 3000);
    return () => clearTimeout(timer);
  }, [index, images.length]);
  return (
    <li className="border rounded p-4">
      {images.length > 0 && (
        <div className="mb-2 relative">
          <img src={images[index]} alt="service" className="w-full h-40 object-cover rounded" />
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_: string, i: number) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full border ${i === index ? "bg-blue-500" : "bg-gray-300"}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Chọn ảnh ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="font-medium mb-2">{service.name}</div>
      <div className="text-sm text-muted-foreground whitespace-pre-line mb-2">{service.description}</div>
      <div className="mt-2 font-semibold">{service.price.toLocaleString()} đ</div>
    </li>
  );
}
