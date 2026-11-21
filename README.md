# Christmas Village 3D — Interactive Winter Wonderland

**Live Demo:** https://anhtuan30012005.github.io/christmas-village-3d/

Trải nghiệm **Thung Lũng 5 Ngôi Làng Giáng Sinh 3D** thời gian thực chạy trực tiếp trên trình duyệt bằng **Three.js / WebGL**, tự động build và deploy lên **GitHub Pages** qua **GitHub Actions**.

## Kiến trúc 5 khu vực trong Thung Lũng Giáng Sinh
- **Quảng Trường Trung Tâm 2 Vòng Đồng Tâm:** Cây thông Noel 14 tầng ngôi sao 8 tia, vòm dây đèn vàng mật ong tỏa sáng, Nhà thờ Gothic tháp đôi, Tháp đồng hồ 10:10, 40+ nhà gỗ mái tuyết nhả khói ống khói và chợ Noel tấp nập.
- **Phố Cổng Chào Phía Nam:** Đại lộ lát đá giăng dây đèn với cổng chào **"★ CHÚC MỪNG GIÁNG SINH ★"** (hỗ trợ tùy chỉnh dòng chữ phát sáng trực tiếp qua nút `💌 Sửa Cổng Chào`).
- **Làng Hồ Băng Phía Tây (`⛸ Hồ Băng`):** Hồ đóng băng xanh ngọc có vết trượt phản sáng, cầu gỗ vòm treo đèn lồng, nhà gỗ ven bờ và 16 người trượt băng lượn vòng.
- **Khu Hội Chợ Đêm Phía Đông (`🎡 Hội Chợ`):** Vòng Quay Mặt Trời voxel quay êm với 12 cabin phát sáng tự cân bằng, lửa trại bập bùng có tàn lửa bay lên và cư dân quây quần sưởi ấm.
- **Làng Xưởng Quà Santa Phía Bắc (`🚂 Xưởng Santa`):** Xưởng đồ chơi gỗ 2 cánh, bánh răng đồng hồ vàng xoay, núi hộp quà, nhà ga gỗ và **Đoàn Tàu Hơi Nước Polar Express** chạy vòng tròn nối liền cả 5 ngôi làng.
- **Bầu Trời Đêm Bắc Cực:** Cực quang Aurora Borealis shader, xe tuần lộc Ông già Noel + Rudolph mũi đỏ rải bụi sao vàng, 2.600 bông tuyết rơi và ~190 cư dân sinh hoạt.

## Điều khiển & Góc Nhìn Thượng Đế
- **Nút `👁 Tự Do` (Phím `F`):** Bật chế độ bay tự do 6 trục đi vào mọi ngóc ngách (`WASD` / mũi tên bay, kéo chuột xoay 360°, cuộn chuột lướt tiến/lùi, `Space/E` lên cao, `Q/C` hạ sát mặt phố, `Shift` tăng tốc 2.6×).
- **Nút `🦅 Đỉnh Trời` (Phím `G`):** Góc nhìn thẳng từ đỉnh trời bao quát toàn bộ thung lũng 5 ngôi làng.
- **Nhấp đúp (Double-Click)** vào bất kỳ ngôi nhà, con phố hay chi tiết nào: Camera tự động bay mượt sát tới tận nơi.
- **Nút `🚶 Đi Dạo`:** Tự động bay điện ảnh xuyên cổng chào và vòng qua cả 5 ngôi làng.

## Tự động Deploy bằng GitHub Actions
Workflow `.github/workflows/deploy.yml` tự động phát hành trang web tại `https://anhtuan30012005.github.io/christmas-village-3d/` mỗi khi push lên nhánh `main`.
