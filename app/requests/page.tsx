export const dynamic = "force-dynamic";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { RequestModel } from "@/lib/models/Request";
import { Service } from "@/lib/models/Service";

export default async function RequestsPage() {
	await connectMongo();
	const user = await User.findOne({ email: "customer@thanhlab.vn" });
	const items = user ? await RequestModel.find({ user: user._id }).populate("service").lean() : [];
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Yêu cầu hỗ trợ</h1>
			{!items.length ? <p>Chưa có yêu cầu.</p> : (
				<ul className="space-y-3">
					{items.map((r: any) => (
						<li key={String(r._id)} className="border rounded p-4 space-y-2">
							<div className="font-medium">{r.content}</div>
							<div className="text-sm text-muted-foreground">
								Dịch vụ: {r.service?.name || "N/A"} | Trạng thái: {r.status}
							</div>
							{r.adminReply && (
								<div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
									<div className="text-sm font-medium text-blue-800">Phản hồi từ Admin:</div>
									<div className="text-sm text-blue-700 mt-1">{r.adminReply}</div>
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


