export const dynamic = "force-dynamic";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { RequestModel } from "@/lib/models/Request";

export default async function RequestsPage() {
	await connectMongo();
	const user = await User.findOne({ email: "customer@thanhlab.vn" });
	const items = user ? await RequestModel.find({ user: user._id }).lean() : [];
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Yêu cầu hỗ trợ</h1>
			{!items.length ? <p>Chưa có yêu cầu.</p> : (
				<ul className="space-y-3">
					{items.map((r: any) => (
						<li key={String(r._id)} className="border rounded p-4">
							<div className="font-medium">{r.content}</div>
							<div className="text-sm text-muted-foreground">Trạng thái: {r.status}</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


