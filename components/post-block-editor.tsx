"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const blockTypes = [
  { type: "text", label: "Văn bản" },
  { type: "code", label: "Code" },
  { type: "image", label: "Ảnh" },
  { type: "video", label: "Video" }
];

export type PostBlock = {
  type: "text" | "code" | "image" | "video";
  content: string;
};

export function PostBlockEditor({ value, onChange }: { value: PostBlock[]; onChange: (blocks: PostBlock[]) => void }) {
  const [blocks, setBlocks] = useState<PostBlock[]>(value || []);

  function addBlock(type: PostBlock["type"]) {
    const newBlocks = [...blocks, { type, content: "" }];
    setBlocks(newBlocks);
    onChange(newBlocks);
  }

  function updateBlock(idx: number, content: string) {
    const newBlocks = blocks.map((b, i) => i === idx ? { ...b, content } : b);
    setBlocks(newBlocks);
    onChange(newBlocks);
  }

  function removeBlock(idx: number) {
    const newBlocks = blocks.filter((_, i) => i !== idx);
    setBlocks(newBlocks);
    onChange(newBlocks);
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    const newBlocks = [...blocks];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setBlocks(newBlocks);
    onChange(newBlocks);
  }

  return (
    <div className="flex">
      {/* Mini tool sidebar */}
      <div className="flex flex-col gap-3 p-2 bg-gray-50 rounded-l">
        {blockTypes.map(bt => (
          <Button key={bt.type} size="icon" title={bt.label} onClick={() => addBlock(bt.type as PostBlock["type"])}>
            {bt.label[0]}
          </Button>
        ))}
      </div>
      {/* Block editor area */}
      <div className="flex-1 p-4 bg-white rounded-r space-y-4">
        {blocks.map((block, idx) => (
          <div key={idx} className="border rounded p-3 mb-2 bg-gray-100">
            <div className="flex gap-2 mb-2">
              <span className="font-semibold">{blockTypes.find(bt => bt.type === block.type)?.label}</span>
              <Button size="sm" variant="outline" onClick={() => moveBlock(idx, -1)} disabled={idx === 0}>↑</Button>
              <Button size="sm" variant="outline" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1}>↓</Button>
              <Button size="sm" variant="destructive" onClick={() => removeBlock(idx)}>Xóa</Button>
            </div>
            {block.type === "text" && (
              <textarea className="w-full border rounded px-2 py-1" value={block.content} onChange={e => updateBlock(idx, e.target.value)} placeholder="Nhập văn bản..." />
            )}
            {block.type === "code" && (
              <textarea className="w-full border rounded px-2 py-1 font-mono" value={block.content} onChange={e => updateBlock(idx, e.target.value)} placeholder="Nhập mã code..." />
            )}
            {block.type === "image" && (
              <input className="w-full border rounded px-2 py-1" value={block.content} onChange={e => updateBlock(idx, e.target.value)} placeholder="URL ảnh..." />
            )}
            {block.type === "video" && (
              <input className="w-full border rounded px-2 py-1" value={block.content} onChange={e => updateBlock(idx, e.target.value)} placeholder="URL video..." />
            )}
          </div>
        ))}
        {blocks.length === 0 && <div className="text-gray-400 italic">Chưa có nội dung, hãy thêm khối mới.</div>}
      </div>
    </div>
  );
}
