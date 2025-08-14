export const dynamic = "force-dynamic";
import Link from "next/link";
import { connectMongo } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export default async function PostsPage() {
	await connectMongo();
	const posts = await Post.find().sort({ createdAt: -1 }).lean();

	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Bài viết kỹ thuật</h1>
			{!posts.length ? (
				<p>Chưa có bài viết nào.</p>
			) : (
				<div className="grid gap-4">
					{posts.map((post: any) => (
						<article key={String(post._id)} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
							<Link href={`/posts/${post.slug}`} className="block">
								<h2 className="text-lg font-semibold text-blue-600 hover:text-blue-800 mb-2">
									{post.title}
								</h2>
							</Link>
							<div className="text-sm text-muted-foreground mb-3">
								{new Date(post.createdAt).toLocaleDateString("vi-VN")}
								{post.tags?.length > 0 && (
									<span className="ml-3">
										Tags: {post.tags.join(", ")}
									</span>
								)}
							</div>
							<p className="text-gray-700 line-clamp-3">
								{post.content.length > 200 
									? `${post.content.substring(0, 200)}...` 
									: post.content
								}
							</p>
							<Link 
								href={`/posts/${post.slug}`}
								className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
							>
								Đọc tiếp →
							</Link>
						</article>
					))}
				</div>
			)}
		</div>
	);
}


