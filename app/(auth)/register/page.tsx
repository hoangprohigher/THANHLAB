"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if already logged in
  if (session) {
    if (session.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng...");
        
        // Auto login after successful registration
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.ok) {
          // Check user role and redirect accordingly
          const userResponse = await fetch("/api/auth/me");
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
        } else {
          router.push("/login");
        }
      } else {
        setError(data.error || "Đăng ký thất bại");
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản THANHLAB
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tạo tài khoản mới để bắt đầu
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ tên</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


