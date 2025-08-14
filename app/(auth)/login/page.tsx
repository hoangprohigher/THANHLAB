"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		const res = await signIn("credentials", { email, password, redirect: false });
		if (res?.error) {
			setError("Đăng nhập thất bại");
		} else {
			router.push("/");
		}
	}

	return (
		<div className="max-w-sm">
			<h1 className="text-xl font-semibold mb-4">Đăng nhập</h1>
			<form className="space-y-3" onSubmit={onSubmit}>
				<input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="w-full border rounded px-3 py-2" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
				{error && <p className="text-sm text-red-600">{error}</p>}
				<Button type="submit">Đăng nhập</Button>
			</form>
		</div>
	);
}


