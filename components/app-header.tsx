"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AppHeader() {
	const { data: session, status } = useSession();
	return (
		<header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
			<div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
				<Link href="/" className="text-xl font-bold tracking-tight">
					THANHLAB
				</Link>
				<nav className="flex items-center gap-4 text-sm">
					<Link href="/">Trang chủ</Link>
					<Link href="/catalog">Sản phẩm</Link>
					<Link href="/services">Dịch vụ</Link>
					<Link href="/posts">Bài viết</Link>
				</nav>
				<div className="text-sm">
					{status === "authenticated" ? (
						<div className="flex items-center gap-2">
							<span>Xin chào, {session.user?.name}</span>
							<button className="underline" onClick={() => signOut()}>Đăng xuất</button>
						</div>
					) : (
						<button className="underline" onClick={() => signIn()}>Đăng nhập</button>
					)}
				</div>
			</div>
		</header>
	);
}


