"use client";
import useSWR from "swr";
import { MessageSquare, Clock, CheckCircle, XCircle, Reply } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminRequestsPage() {
  const { data, mutate } = useSWR("/api/admin/requests", fetcher);

  async function update(id: string, status: string, adminReply?: string) {
    await fetch("/api/admin/requests", { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ id, status, adminReply }) 
    });
    mutate();
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu hỗ trợ</h2>
        <div className="text-sm text-gray-500">
          Tổng cộng: {data?.items?.length || 0} yêu cầu
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách yêu cầu</h3>
        </div>
        <div className="divide-y">
          {(data?.items || []).map((request: any) => (
            <div key={String(request._id)} className="px-6 py-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{request.content}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(request.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status === "open" && "Mới"}
                    {request.status === "in_progress" && "Đang xử lý"}
                    {request.status === "resolved" && "Đã xử lý"}
                    {request.status === "closed" && "Đã đóng"}
                  </span>
                </div>
              </div>

              {/* Admin Reply Form */}
              <div className="ml-12">
                <form 
                  className="flex items-center gap-2 text-sm" 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    const reply = (e.currentTarget.elements.namedItem('reply') as HTMLInputElement).value; 
                    update(String(request._id), request.status, reply); 
                  }}
                >
                  <div className="flex-1">
                    <input 
                      name="reply" 
                      className="w-full border rounded px-3 py-2" 
                      placeholder="Nhập phản hồi của admin..." 
                      defaultValue={request.adminReply || ""} 
                    />
                  </div>
                  <button 
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    type="submit"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Lưu phản hồi
                  </button>
                </form>
              </div>

              {/* Status Actions */}
              <div className="ml-12 flex gap-2 text-sm">
                <button 
                  className="px-3 py-1 border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
                  onClick={() => update(String(request._id), "in_progress", request.adminReply)}
                >
                  Đang xử lý
                </button>
                <button 
                  className="px-3 py-1 border border-green-300 text-green-700 rounded hover:bg-green-50"
                  onClick={() => update(String(request._id), "resolved", request.adminReply)}
                >
                  Đã xử lý
                </button>
                <button 
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  onClick={() => update(String(request._id), "closed", request.adminReply)}
                >
                  Đóng
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


