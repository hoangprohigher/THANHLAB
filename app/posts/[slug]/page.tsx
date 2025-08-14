export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectMongo } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
	const { slug } = await params;
	await connectMongo();
	const post = await Post.findOne({ slug }).lean();

	if (!post) {
		notFound();
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<Link 
				href="/posts" 
				className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
			>
				← Quay lại danh sách bài viết
			</Link>

			<article className="prose prose-lg max-w-none">
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						{post.title}
					</h1>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span>
							{new Date(post.createdAt).toLocaleDateString("vi-VN", {
								year: "numeric",
								month: "long",
								day: "numeric"
							})}
						</span>
						{post.tags?.length > 0 && (
							<div className="flex gap-2">
								{post.tags.map((tag: string, index: number) => (
									<span 
										key={index}
										className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</header>

				<div className="text-gray-700 leading-relaxed">
					{post.content.split('\n').map((paragraph: string, index: number) => (
						paragraph.trim() ? (
							<p key={index} className="mb-4">
								{paragraph}
							</p>
						) : (
							<br key={index} />
						)
					))}
				</div>
			</article>

			<div className="border-t pt-6">
				<Link 
					href="/posts" 
					className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
				>
					← Xem tất cả bài viết
				</Link>
			</div>
		</div>
	);
}
