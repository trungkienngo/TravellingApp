# TravellingApp - bản sửa cho Expo SDK 51

## Các thay đổi
- Khôi phục App.js đầy đủ 22 màn hình từ bản dự án gộp; không còn App.js chỉ có SigninScreen.
- Đưa Metro về cấu hình mặc định của Expo.
- Xóa import react-native-maps không sử dụng trong PropertyDetailScreen.js.
- Thêm MapScreen riêng cho Web: mở Google Maps, giữ màn hình bản đồ gốc trên Android/iOS.
- Tách Firebase Auth cho Web (`firebaseConfig.web.js`) và React Native (`firebaseConfig.js`).
- Bỏ các đường dẫn icon/splash rỗng trong app.json.

## Chạy trên Windows PowerShell
1. Sao lưu thư mục dự án cũ. Giải nén ZIP này ra một thư mục mới.
2. Mở terminal tại thư mục chứa package.json.
3. Chạy:

```powershell
npm install
npx expo start --web --clear
```

Nếu dùng Android: `npx expo start --android`.

## Chú ý
- Chưa thể chạy kiểm thử thực tế với Firebase hay trình duyệt của bạn trong môi trường này. Nếu vẫn có lỗi, gửi ảnh màn hình lỗi đầu tiên.
- Web MapScreen dùng liên kết Google Maps thay vì bản đồ nhúng; Android/iOS giữ MapView cũ.
- Nếu cần tính năng đăng nhập Firebase trên web, phải cấu hình Authorized Domains trong Firebase Console.
- API key Tomorrow.io đang nằm trong mã nguồn MapScreen gốc; hãy chuyển sang backend trước khi triển khai công khai, và thay khóa nếu đã bị lộ.
- Chưa thay đổi nghiệp vụ thanh toán hay cấu trúc Firestore để tránh làm sai dữ liệu.
