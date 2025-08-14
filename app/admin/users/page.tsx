"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Edit, Trash2, Plus } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminUsersPage() {
  const { data, mutate } = useSWR("/api/admin/users", fetcher);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");

  async function addUser() {
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role }),
    });
    setName("");
    setEmail("");
    setRole("customer");
    mutate();
  }

  async function updateUser(id: string, updates: any) {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    mutate();
  }

  async function removeUser(id: string) {
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} người dùng
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Thêm người dùng mới
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Vai trò người dùng"
          >
            <option value="customer">Khách hàng</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={addUser} disabled={!name || !email}>
            Thêm
          </Button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách người dùng</h3>
        </div>
        <div className="divide-y">
          {(data?.items || []).map((user: any) => (
            <div key={String(user._id)} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newRole = user.role === "admin" ? "customer" : "admin";
                    updateUser(String(user._id), { role: newRole });
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {user.role === "admin" ? "Hạ quyền" : "Thăng quyền"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeUser(String(user._id))}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


