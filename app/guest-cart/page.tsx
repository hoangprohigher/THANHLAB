
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type CartItem = {
  image: string;
  code: string;
  name: string;
  price: number;
  qty: number;
};

const paymentMethods = [
  "Chuẩn bị hàng để khách qua lấy và thanh toán tại cửa hàng",
  "Ship hàng cho khách (áp dụng với khách tại Hà Nội)",
  "Gửi qua dịch vụ chuyển phát (ViettelPost)",
  "Gửi hàng ra xe"
];

export default function GuestCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    backupPhone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    email: "",
    note: "",
    invoice: false,
    payment: paymentMethods[0]
  });
  useEffect(() => {
    const saved = localStorage.getItem("guest-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const handleOrder = async () => {
    if (!form.name || !form.phone || cart.length === 0) return alert("Vui lòng nhập đủ thông tin và có sản phẩm trong giỏ hàng");
    const res = await fetch("/api/guest-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, form })
    });
    if (res.ok) {
      localStorage.removeItem("guest-cart");
      setCart([]);
      alert("Đặt hàng thành công! Đơn sẽ được admin xác nhận.");
    } else {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-extrabold mb-6 text-blue-700">GIỎ HÀNG</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-base">
              <th className="py-2 px-3 font-semibold text-left">Sản phẩm</th>
              <th className="py-2 px-3 font-semibold text-right">Đơn giá</th>
              <th className="py-2 px-3 font-semibold text-center">Số lượng</th>
              <th className="py-2 px-3 font-semibold text-right">Số tiền</th>
              <th className="py-2 px-3 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-500">Chưa có sản phẩm trong giỏ hàng</td></tr>
            ) : cart.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-blue-50 transition">
                <td className="py-2 px-3 flex items-center gap-3">
                  <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover rounded-lg border shadow" />
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </td>
                <td className="text-right text-orange-600 font-bold">{typeof item.price === "number" ? item.price.toLocaleString() : 0} đ</td>
                <td className="text-center">
                  <label htmlFor={`qty-${idx}`} className="sr-only">Số lượng</label>
                  <input
                    id={`qty-${idx}`}
                    type="number"
                    min={1}
                    value={item.qty ?? 1}
                    onChange={e => {
                      const newQty = Number(e.target.value);
                      if (newQty > 0) {
                        const newCart = [...cart];
                        newCart[idx].qty = newQty;
                        setCart(newCart);
                      }
                    }}
                    className="border rounded px-2 py-1 w-16 text-center mr-2"
                    placeholder="Số lượng"
                  />
                  <button
                    onClick={() => {
                      localStorage.setItem("guest-cart", JSON.stringify(cart));
                      setCart([...cart]);
                    }}
                    className="bg-gray-900 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded shadow transition"
                  >
                    Cập nhật
                  </button>
                </td>
                <td className="text-right font-bold">{typeof item.price === "number" && typeof item.qty === "number" ? (item.price * item.qty).toLocaleString() : 0} đ</td>
                <td className="text-center">
                  <button
                    onClick={() => {
                      const newCart = cart.filter((_, i) => i !== idx);
                      setCart(newCart);
                      localStorage.setItem("guest-cart", JSON.stringify(newCart));
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded shadow transition"
                    title="Xóa sản phẩm"
                  >
                    <span className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Xóa</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  <div className="mb-4 font-bold">Tổng cộng: {cart.reduce((sum, i) => sum + (typeof i.price === "number" && typeof i.qty === "number" ? i.price * i.qty : 0), 0).toLocaleString()} đ</div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="mb-2">
            <label htmlFor="name">Họ và Tên:</label>
            <input name="name" id="name" value={form.name} onChange={handleChange} className="border w-full p-1" placeholder="Nhập họ tên" />
          </div>
          <div className="mb-2">
            <label htmlFor="phone">Số điện thoại:</label>
            <input name="phone" id="phone" value={form.phone} onChange={handleChange} className="border w-full p-1" placeholder="Nhập số điện thoại" />
          </div>
          <div className="mb-2">
            <label htmlFor="backupPhone">Số dự phòng:</label>
            <input name="backupPhone" id="backupPhone" value={form.backupPhone} onChange={handleChange} className="border w-full p-1" placeholder="Số dự phòng (nếu có)" />
          </div>
          <div className="mb-2">
            <label htmlFor="city">Tỉnh/Thành phố:</label>
            <input name="city" id="city" value={form.city} onChange={handleChange} className="border w-full p-1" placeholder="Tỉnh/Thành phố" />
          </div>
          <div className="mb-2">
            <label htmlFor="district">Quận/Huyện:</label>
            <input name="district" id="district" value={form.district} onChange={handleChange} className="border w-full p-1" placeholder="Quận/Huyện" />
          </div>
          <div className="mb-2">
            <label htmlFor="ward">Phường/Xã:</label>
            <input name="ward" id="ward" value={form.ward} onChange={handleChange} className="border w-full p-1" placeholder="Phường/Xã" />
          </div>
          <div className="mb-2">
            <label htmlFor="address">Số, đường, thôn xóm:</label>
            <input name="address" id="address" value={form.address} onChange={handleChange} className="border w-full p-1" placeholder="Số, đường, thôn xóm" />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Thư điện tử:</label>
            <input name="email" id="email" value={form.email} onChange={handleChange} className="border w-full p-1" placeholder="Email" />
          </div>
          <div className="mb-2">
            <label htmlFor="note">Ghi chú đơn hàng:</label>
            <input name="note" id="note" value={form.note} onChange={handleChange} className="border w-full p-1" placeholder="Ghi chú" />
          </div>
          <div className="mb-2"><label><input type="checkbox" name="invoice" checked={form.invoice} onChange={handleChange} /> Tôi muốn viết hóa đơn (có thêm phí)</label></div>
        </div>
        <div>
          <div className="mb-2 font-bold">Phương thức thanh toán</div>
          {paymentMethods.map((pm, i) => (
            <div key={i} className="mb-2">
              <label><input type="radio" name="payment" value={pm} checked={form.payment === pm} onChange={handleChange} /> {pm}</label>
            </div>
          ))}
          <div className="mb-2 text-sm text-muted-foreground">Lưu ý:<br />- Cước vận chuyển dự kiến được tính với đơn hàng 1kg. Nếu đơn hàng &lt; 1kg thì cước vận chuyển thực tế sẽ nhỏ hơn, nếu đơn hàng &gt;1kg thì cước vận chuyển thực tế sẽ lớn hơn</div>
        </div>
      </form>
      <div className="flex gap-4">
        <Button onClick={handleOrder}>ĐẶT HÀNG</Button>
        <Button variant="outline" onClick={() => window.location.href = "/catalog"}>MUA THÊM</Button>
      </div>
    </div>
  );
}
