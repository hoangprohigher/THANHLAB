import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Chào mừng đến với THANHLAB</h1>
      <p className="text-muted-foreground">
        Nền tảng thương mại điện tử và dịch vụ hỗ trợ đồ án. Bắt đầu khám phá
        danh mục sản phẩm, dịch vụ và bài viết kỹ thuật.
      </p>
      <div className="flex gap-3">
        <Button>Khám phá sản phẩm</Button>
        <Button variant="outline">Dịch vụ hỗ trợ</Button>
      </div>
    </div>
  );
}
