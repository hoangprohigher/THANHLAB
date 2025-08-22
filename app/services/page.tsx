export const dynamic = "force-dynamic";
import { connectMongo } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";

import { ServiceCard } from "@/components/service-card";

export default async function ServicesPage() {
	await connectMongo();
	const services = await Service.find().lean();
	return (
		<div className="space-y-6">
			<h1 className="text-xl font-semibold">Dịch vụ hỗ trợ đồ án</h1>
			<ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{services.map((s: any) => (
					<ServiceCard key={String(s._id)} service={s} />
				))}
			</ul>
		</div>
	);
}



