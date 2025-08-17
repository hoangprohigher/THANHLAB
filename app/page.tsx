"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import React from "react";

export default function Home() {
  const router = useRouter();
  const { data: slideImages } = useSWR("/api/slide-images", (url) => fetch(url).then(r => r.json()));
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Wipe effect: fade out, change image, fade in
  const [wipe, setWipe] = React.useState(false);
  React.useEffect(() => {
    if (!slideImages || slideImages.length === 0) return;
    timeoutRef.current = setTimeout(() => {
      setWipe(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % slideImages.length);
        setWipe(false);
      }, 400); // wipe duration
    }, 3000); // show duration
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, slideImages]);

  return (
    <div className="space-y-6">
      {/* Slideshow */}
      {slideImages && slideImages.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div
            className={`relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 transition-all duration-400 ${wipe ? "animate-wipe" : ""}`}
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
          >
            <img
              src={slideImages[index].url}
              alt="slide"
              className="w-full h-full object-cover"
              style={{ opacity: wipe ? 0 : 1, transition: "opacity 0.4s" }}
            />
          </div>
          <div className="flex justify-center gap-2 mt-2">
            {slideImages.map((_: any, i: number) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${i === index ? "bg-blue-500" : "bg-gray-300"}`}
                onClick={() => { setIndex(i); setWipe(true); setTimeout(() => setWipe(false), 400); }}
                aria-label={`Chọn ảnh ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
      <h1 className="text-2xl font-semibold">Chào mừng đến với THANHLAB</h1>
      <p className="text-muted-foreground">
        Nền tảng thương mại điện tử và dịch vụ hỗ trợ đồ án. Bắt đầu khám phá
        danh mục sản phẩm, dịch vụ và bài viết kỹ thuật.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => router.push("/catalog")}>Khám phá sản phẩm</Button>
        <Button variant="outline" onClick={() => router.push("/services")}> 
          Dịch vụ hỗ trợ
        </Button>
      </div>
      <style>{`
        @keyframes wipe {
          0% { opacity: 1; }
          40% { opacity: 0; }
          60% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-wipe img { animation: wipe 0.4s linear; }
      `}</style>
    </div>
  );
}
