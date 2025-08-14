import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET || "dev-secret",
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				await connectMongo();
				const user = await User.findOne({ email: credentials.email });
				if (!user) return null;
				const ok = await compare(credentials.password, user.passwordHash);
				if (!ok) return null;
				return { id: String(user._id), name: user.name, email: user.email, role: user.role } as any;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = (user as any).id;
				token.role = (user as any).role || "customer";
			}
			return token;
		},
		async session({ session, token }) {
			(session as any).user.id = token.id;
			(session as any).user.role = token.role;
			return session;
		},
	},
};


