# Christmas Village 3D — Interactive Winter Wonderland

Trải nghiệm ngôi làng Giáng sinh 3D thời gian thực chạy trực tiếp trên trình duyệt bằng **Three.js / WebGL**, tự động deploy lên **GitHub Pages** qua **GitHub Actions**.

## Tính năng nổi bật

- **Làng Giáng Sinh 3D toàn màn hình (`index.html`):**
  - Quảng trường đá cuội hình tròn rộng rãi với cây thông Noel trung tâm 14 tầng, dải đèn xoắn vàng và ngôi sao 8 tia phát sáng.
  - Nhà thờ Gothic tháp đôi (cửa sổ hoa hồng 12 nan, cổng vòm phát sáng), Tháp đồng hồ 10:10, 16 ngôi nhà cổ mái tuyết có khói ống khói bay theo gió.
  - Đại lộ lễ hội kéo dài ra ngoài mép làng với cổng chào cao phát sáng **"★ CHÚC MỪNG GIÁNG SINH ★"** (hỗ trợ tùy chỉnh trực tiếp qua nút `💌 Sửa Cổng Chào`) và 68 cư dân mùa đông đi lại tấp nập.
  - Vành đai đồi thông tuyết, núi tuyết bậc thang voxel, **Cực quang Bắc Cực (Aurora Borealis)** và **xe tuần lộc Ông Già Noel** bay lượn trên bầu trời sao.
  - Giao diện **Glassmorphism** toàn màn hình với 5 góc máy điện ảnh mượt mà (*Toàn Cảnh*, *Cổng Chào*, *Quảng Trường*, *Nhà Thờ*, *Đi Dạo xuyên cổng chào*), nhạc nền và chụp ảnh PNG.
- **Thành Phố Hạt Sáng (`city.html`):** Phiên bản nghệ thuật Point Cloud / Particle 7 lớp chiều sâu với hơn 58.000 hạt sáng GPU.
- **Cây Thông ASCII 3D (`ascii.html`):** Phiên bản nghệ thuật Terminal ASCII 3D tương tác.

## Điều khiển

- **Kéo chuột:** Xoay tự do 360°
- **Cuộn chuột:** Phóng to / thu nhỏ
- **Nút `🚶 Đi Dạo`:** Camera tự động bay xuyên qua cổng chào vào tâm quảng trường

## Deploy tự động bằng GitHub Actions

Workflow `.github/workflows/deploy.yml` tự động phát hành trang web mỗi khi push lên nhánh `main`.
Trên GitHub repo, vào **Settings → Pages → Build and deployment → Source: GitHub Actions**.
