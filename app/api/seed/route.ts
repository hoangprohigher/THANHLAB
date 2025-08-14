import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { Service } from "@/lib/models/Service";
import { Post } from "@/lib/models/Post";
import bcrypt from "bcryptjs";

export async function POST() {
	await connectMongo();

	// Clear existing data
	await Promise.all([
		User.deleteMany({}),
		Category.deleteMany({}),
		Product.deleteMany({}),
		Service.deleteMany({}),
		Post.deleteMany({}),
	]);

	// Create admin user
	const adminPasswordHash = await bcrypt.hash("admin123", 10);
	const admin = await User.create({
		name: "Admin THANHLAB",
		email: "admin@thanhlab.vn",
		passwordHash: adminPasswordHash,
		role: "admin",
	});

	// Create customer user
	const customerPasswordHash = await bcrypt.hash("customer123", 10);
	const customer = await User.create({
		name: "Khách hàng Demo",
		email: "customer@thanhlab.vn",
		passwordHash: customerPasswordHash,
		role: "customer",
	});

	// Create categories
	const categories = await Category.create([
		{
			name: "Linh kiện điện tử",
			slug: "linh-kien-dien-tu",
			description: "Các linh kiện điện tử cơ bản và nâng cao",
		},
		{
			name: "Robot & Tự động hóa",
			slug: "robot-tu-dong-hoa",
			description: "Robot công nghiệp và hệ thống tự động hóa",
		},
		{
			name: "Cảm biến & Đo lường",
			slug: "cam-bien-do-luong",
			description: "Cảm biến và thiết bị đo lường chính xác",
		},
		{
			name: "Bảng mạch điều khiển",
			slug: "bang-mach-dieu-khien",
			description: "Bảng mạch Arduino, Raspberry Pi và các module điều khiển",
		},
	]);

	// Create products
	const products = await Product.create([
		{
			name: "Arduino Uno R3",
			slug: "arduino-uno-r3",
			description: "Bảng mạch Arduino Uno R3 chính hãng, tương thích với nhiều shield và module",
			price: 150000,
			stock: 50,
			category: categories[3]._id,
			images: ["arduino-uno.jpg"],
		},
		{
			name: "Raspberry Pi 4 Model B 4GB",
			slug: "raspberry-pi-4-4gb",
			description: "Máy tính mini Raspberry Pi 4 với RAM 4GB, hỗ trợ 4K video",
			price: 1200000,
			stock: 25,
			category: categories[3]._id,
			images: ["raspberry-pi-4.jpg"],
		},
		{
			name: "Cảm biến nhiệt độ DHT22",
			slug: "cam-bien-nhiet-do-dht22",
			description: "Cảm biến nhiệt độ và độ ẩm DHT22 độ chính xác cao",
			price: 85000,
			stock: 100,
			category: categories[2]._id,
			images: ["dht22.jpg"],
		},
		{
			name: "Servo Motor SG90",
			slug: "servo-motor-sg90",
			description: "Servo motor 9g với góc quay 180 độ, phù hợp cho robot nhỏ",
			price: 45000,
			stock: 200,
			category: categories[1]._id,
			images: ["sg90-servo.jpg"],
		},
		{
			name: "LED RGB WS2812B",
			slug: "led-rgb-ws2812b",
			description: "LED RGB điều khiển đơn lẻ, có thể tạo hiệu ứng ánh sáng đẹp mắt",
			price: 25000,
			stock: 500,
			category: categories[0]._id,
			images: ["ws2812b.jpg"],
		},
		{
			name: "Motor DC 12V với bánh xe",
			slug: "motor-dc-12v-banh-xe",
			description: "Motor DC 12V kèm bánh xe, phù hợp cho xe robot và dự án di chuyển",
			price: 180000,
			stock: 30,
			category: categories[1]._id,
			images: ["dc-motor-wheel.jpg"],
		},
		{
			name: "Module Relay 5V 4 kênh",
			slug: "module-relay-5v-4-kenh",
			description: "Module relay 5V 4 kênh, điều khiển thiết bị điện 220V an toàn",
			price: 95000,
			stock: 80,
			category: categories[0]._id,
			images: ["relay-module.jpg"],
		},
		{
			name: "Cảm biến khoảng cách HC-SR04",
			slug: "cam-bien-khoang-cach-hc-sr04",
			description: "Cảm biến siêu âm đo khoảng cách từ 2cm đến 400cm",
			price: 65000,
			stock: 150,
			category: categories[2]._id,
			images: ["hc-sr04.jpg"],
		},
	]);

	// Create services
	const services = await Service.create([
		{
			name: "Tư vấn thiết kế robot",
			slug: "tu-van-thiet-ke-robot",
			description: "Tư vấn và thiết kế robot theo yêu cầu cụ thể của khách hàng",
			price: 500000,
		},
		{
			name: "Lập trình điều khiển tự động",
			slug: "lap-trinh-dieu-khien-tu-dong",
			description: "Viết code điều khiển cho các hệ thống tự động hóa",
			price: 800000,
		},
		{
			name: "Thiết kế mạch điện tử",
			slug: "thiet-ke-mach-dien-tu",
			description: "Thiết kế và chế tạo mạch điện tử theo yêu cầu",
			price: 1200000,
		},
		{
			name: "Hỗ trợ đồ án tốt nghiệp",
			slug: "ho-tro-do-an-tot-nghiep",
			description: "Hỗ trợ hoàn thiện đồ án tốt nghiệp về điện tử, tự động hóa",
			price: 2000000,
		},
	]);

	// Create technical posts
	const posts = await Post.create([
		{
			user: admin._id,
			title: "Hướng dẫn lập trình Arduino cơ bản",
			slug: "huong-dan-lap-trinh-arduino-co-ban",
			content: `Arduino là một nền tảng phát triển phần cứng và phần mềm mã nguồn mở, được thiết kế để làm cho việc tạo ra các ứng dụng điện tử tương tác trở nên dễ dàng hơn.

Trong bài viết này, chúng ta sẽ tìm hiểu về:
- Cài đặt Arduino IDE
- Cấu trúc chương trình Arduino cơ bản
- Các lệnh điều khiển LED
- Đọc tín hiệu từ cảm biến
- Giao tiếp Serial

Arduino IDE là môi trường phát triển tích hợp chính thức cho Arduino. Bạn có thể tải về từ trang web chính thức của Arduino.

Cấu trúc chương trình Arduino bao gồm hai hàm chính:
- setup(): Chạy một lần khi khởi động
- loop(): Chạy liên tục sau khi setup() hoàn thành

Ví dụ đơn giản để nhấp nháy LED:
\`\`\`cpp
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
\`\`\`

Đây là bước đầu tiên để bắt đầu với Arduino. Hãy thực hành và khám phá thêm!`,
			tags: ["Arduino", "Lập trình", "Điện tử", "Cơ bản"],
		},
		{
			user: admin._id,
			title: "Xây dựng robot di chuyển tự động",
			slug: "xay-dung-robot-di-chuyen-tu-dong",
			content: `Robot di chuyển tự động là một dự án thú vị và thực tế trong lĩnh vực robotics. Trong bài viết này, chúng ta sẽ tìm hiểu cách xây dựng một robot đơn giản có thể di chuyển và tránh vật cản.

Các thành phần cần thiết:
- Arduino Uno hoặc Nano
- 2 motor DC với bánh xe
- Module L298N điều khiển motor
- Cảm biến siêu âm HC-SR04
- Khung robot và pin 12V

Kết nối phần cứng:
1. Kết nối motor với module L298N
2. Kết nối cảm biến siêu âm với Arduino
3. Cung cấp nguồn cho hệ thống

Code điều khiển cơ bản:
\`\`\`cpp
#include <NewPing.h>

#define TRIGGER_PIN 12
#define ECHO_PIN 11
#define MAX_DISTANCE 200

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

void setup() {
  // Khởi tạo các chân điều khiển motor
  pinMode(5, OUTPUT); // Motor A
  pinMode(6, OUTPUT); // Motor A
  pinMode(9, OUTPUT); // Motor B
  pinMode(10, OUTPUT); // Motor B
}

void loop() {
  int distance = sonar.ping_cm();
  
  if (distance < 20) {
    // Tránh vật cản
    turnLeft();
    delay(500);
  } else {
    // Di chuyển thẳng
    moveForward();
  }
}

void moveForward() {
  analogWrite(5, 200);
  analogWrite(6, 0);
  analogWrite(9, 200);
  analogWrite(10, 0);
}

void turnLeft() {
  analogWrite(5, 0);
  analogWrite(6, 200);
  analogWrite(9, 200);
  analogWrite(10, 0);
}
\`\`\`

Với code này, robot sẽ di chuyển thẳng và tự động tránh vật cản khi phát hiện khoảng cách gần hơn 20cm.`,
			tags: ["Robot", "Tự động hóa", "Arduino", "Motor", "Cảm biến"],
		},
		{
			user: admin._id,
			title: "Sử dụng cảm biến DHT22 với Raspberry Pi",
			slug: "su-dung-cam-bien-dht22-raspberry-pi",
			content: `Cảm biến DHT22 là một cảm biến nhiệt độ và độ ẩm số có độ chính xác cao, rất phù hợp để sử dụng với Raspberry Pi trong các dự án IoT.

Đặc điểm của DHT22:
- Đo nhiệt độ: -40°C đến 80°C (±0.5°C)
- Đo độ ẩm: 0-100% RH (±2% RH)
- Giao tiếp 1-wire
- Điện áp hoạt động: 3.3V-5V

Kết nối phần cứng:
- VCC → 3.3V hoặc 5V
- DATA → GPIO4 (hoặc GPIO khác)
- GND → GND

Cài đặt thư viện:
\`\`\`bash
sudo apt-get update
sudo apt-get install python3-pip
pip3 install Adafruit_DHT
\`\`\`

Code Python đọc dữ liệu:
\`\`\`python
import Adafruit_DHT
import time

# Cấu hình cảm biến
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4

while True:
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    
    if humidity is not None and temperature is not None:
        print(f"Độ ẩm: {humidity:.1f}%")
        print(f"Nhiệt độ: {temperature:.1f}°C")
    else:
        print("Không thể đọc dữ liệu từ cảm biến")
    
    time.sleep(2)
\`\`\`

Ứng dụng thực tế:
- Hệ thống giám sát môi trường
- Điều khiển điều hòa tự động
- Ghi log dữ liệu thời gian thực
- Cảnh báo khi nhiệt độ/độ ẩm vượt ngưỡng

Lưu ý: DHT22 cần thời gian để ổn định giữa các lần đọc, nên đặt delay ít nhất 2 giây giữa các lần đọc dữ liệu.`,
			tags: ["Raspberry Pi", "DHT22", "Cảm biến", "Python", "IoT"],
		},
	]);

	return NextResponse.json({
		ok: true,
		message: "Đã tạo dữ liệu mẫu thành công",
		stats: {
			users: 2,
			categories: categories.length,
			products: products.length,
			services: services.length,
			posts: posts.length,
		},
	});
}


