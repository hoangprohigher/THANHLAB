
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
      <h1 className="text-xl font-bold mb-4">GIỎ HÀNG</h1>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-red-600 text-white">
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>[Xóa]</th>
          </tr>
        </thead>
        <tbody>
          {cart.length === 0 ? (
            <tr><td colSpan={8} className="text-center">Chưa có sản phẩm trong giỏ hàng</td></tr>
          ) : cart.map((item, idx) => (
            <tr key={idx}>
              <td colSpan={2}>
                <Image src={item.image} alt="sp" width={64} height={64} className="object-cover rounded" />
              </td>
              <td>{item.code}</td>
              <td>{item.name}</td>
              <td>{typeof item.price === "number" ? item.price.toLocaleString() : 0}</td>
              <td>{item.qty ?? 0}</td>
              <td>{typeof item.price === "number" && typeof item.qty === "number" ? (item.price * item.qty).toLocaleString() : 0}</td>
              <td><button onClick={() => {
                const newCart = cart.filter((_, i) => i !== idx);
                setCart(newCart);
                localStorage.setItem("guest-cart", JSON.stringify(newCart));
              }}>❌</button></td>
            </tr>
          ))}
        </tbody>
      </table>
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
