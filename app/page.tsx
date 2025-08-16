"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="space-y-6">
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
    </div>
  );
}
