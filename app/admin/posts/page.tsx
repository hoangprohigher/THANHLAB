"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Edit, Trash2, Plus, Tag } from "lucide-react";
import { PostBlockEditor, PostBlock } from "@/components/post-block-editor";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPostsPage() {
  const { data, mutate } = useSWR("/api/admin/posts", fetcher);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [blocks, setBlocks] = useState<PostBlock[]>([]);

  async function addPost() {
    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
    await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content: JSON.stringify(blocks), tags: tagsArray }),
    });
    setTitle("");
    setSlug("");
    setContent("");
    setTags("");
    setBlocks([]);
    mutate();
  }

  async function removePost(id: string) {
    await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý bài viết kỹ thuật</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} bài viết
        </div>
      </div>

      {/* Add Post Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Thêm bài viết mới
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input
            placeholder="Tags (phân cách bằng dấu phẩy)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <PostBlockEditor value={blocks} onChange={setBlocks} />
        </div>
        <Button onClick={addPost} disabled={!title || !slug || blocks.length === 0}>
          Thêm bài viết
        </Button>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách bài viết</h3>
        </div>
        <div className="divide-y">
          {(data?.items || []).map((post: any) => (
            <div key={String(post._id)} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.slug}</div>
                  <div className="text-xs text-gray-400 flex items-center mt-1">
                    <Tag className="h-3 w-3 mr-1" />
                    {(post.tags || []).join(", ")}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removePost(String(post._id))}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


