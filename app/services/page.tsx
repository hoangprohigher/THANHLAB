import { connectMongo } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";

export default async function ServicesPage() {
	await connectMongo();
	const services = await Service.find().lean();
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Dịch vụ hỗ trợ đồ án</h1>
			<ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{services.map((s: any) => (
					<li key={String(s._id)} className="border rounded p-4">
						<div className="font-medium">{s.name}</div>
						<div className="text-sm text-muted-foreground">{s.description}</div>
						<div className="mt-2 font-semibold">{s.price.toLocaleString()} đ</div>
					</li>
				))}
			</ul>
		</div>
	);
}


