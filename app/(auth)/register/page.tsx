"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMessage(null);
		const res = await fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});
		const data = await res.json();
		if (!res.ok) {
			setMessage(data?.error || "Đăng ký thất bại");
			return;
		}
		setMessage("Đăng ký thành công, hãy đăng nhập.");
		setTimeout(() => router.push("/login"), 800);
	}

	return (
		<div className="max-w-sm">
			<h1 className="text-xl font-semibold mb-4">Đăng ký</h1>
			<form className="space-y-3" onSubmit={onSubmit}>
				<input className="w-full border rounded px-3 py-2" placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="w-full border rounded px-3 py-2" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
				{message && <p className="text-sm">{message}</p>}
				<Button type="submit">Tạo tài khoản</Button>
			</form>
		</div>
	);
}


