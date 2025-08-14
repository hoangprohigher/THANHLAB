export const dynamic = "force-dynamic";
import { connectMongo } from "@/lib/mongodb";
import { Post } from "@/lib/models/Post";

export default async function PostsPage() {
	await connectMongo();
	const posts = await Post.find().lean();
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Bài viết kỹ thuật</h1>
			<ul className="space-y-3">
				{posts.map((p: any) => (
					<li key={String(p._id)} className="border rounded p-4">
						<div className="font-medium">{p.title}</div>
						<div className="text-sm text-muted-foreground">{(p.tags || []).join(", ")}</div>
					</li>
				))}
			</ul>
		</div>
	);
}


