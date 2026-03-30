export interface QueryItem {
  id: number;
  title: string;
  command: string;
  example: string;
}

export const customerInfoQueries: QueryItem[] = [
  {
    id: 1,
    title: "Tìm thông tin HĐ từ SĐT",
    command: "Tra cứu sdt {input}",
    example: "Tra cứu sdt 0366339889",
  },
  {
    id: 2,
    title: "Kiểm tra trùng KHTN từ SĐT",
    command: "Kiểm tra trùng KHTN {input}",
    example: "Kiểm tra trùng KHTN 0366339889",
  },
  {
    id: 3,
    title: "Tình trạng hợp đồng",
    command: "Tra cứu {input}",
    example: "Tra cứu HNH661487",
  },
  {
    id: 4,
    title: "Tiền cước NET theo HĐ",
    command: "Tra cứu cước NET {input}",
    example: "Tra cứu cước NET HNH661487",
  },
  {
    id: 5,
    title: "Tiền thiết bị theo HĐ",
    command: "Tra cứu tiền thiết bị {input}",
    example: "Tra cứu tiền thiết bị HNH661487",
  },
  {
    id: 6,
    title: "5 PTC gần nhất theo HĐ",
    command: "Tra cứu PTC {input}",
    example: "Tra cứu PTC HNH661487",
  },
  {
    id: 7,
    title: "Các lần kết nối NET theo HĐ",
    command: "Các lần kết nối {input}",
    example: "Các lần kết nối HNH661487",
  },
  {
    id: 8,
    title: "Thông số thi công theo HĐ",
    command: "Thông số đầu nhảy HĐ {input}",
    example: "Thông số đầu nhảy HĐ HNH661487",
  },
  {
    id: 9,
    title: "Chi nhánh quản lý hợp đồng",
    command: "Chi nhánh quản lý {input}",
    example: "Chi nhánh quản lý HNH661487",
  },
  {
    id: 10,
    title: "Thông tin số tài khoản ngân hàng của CN",
    command: "Số tài khoản chi nhánh {input}",
    example: "Số tài khoản chi nhánh HPG",
  },
  {
    id: 11,
    title: "Tìm thông tin HĐ từ CCCD/Hộ chiếu/...",
    command: "Tra cứu HĐ từ mã định danh {input}",
    example: "Tra cứu HĐ từ mã định danh 0909090909",
  },
];

export const fptPlayQueries: QueryItem[] = [
  {
    id: 1,
    title: "Các giải đấu thể thao",
    command: "Các giải đấu thể thao trên FPT Play",
    example: "Các giải đấu thể thao trên FPT Play",
  },
  {
    id: 2,
    title: "Lịch phát sóng theo kênh",
    command: "Lịch phát sóng kênh {input}",
    example: "Lịch phát sóng kênh VTV1",
  },
  {
    id: 3,
    title: "Top 10 kênh độc quyền",
    command: "10 kênh VOD độc quyền",
    example: "10 kênh VOD độc quyền",
  },
  {
    id: 4,
    title: "Top 10 kênh mới theo thể loại",
    command: "10 kênh VOD mới {input}",
    example: "10 kênh VOD mới phim lẻ",
  },
  {
    id: 5,
    title: "Top 10 kênh sắp chiếu theo thể loại",
    command: "10 kênh VOD sắp chiếu {input}",
    example: "10 kênh VOD sắp chiếu phim bộ",
  },
  {
    id: 6,
    title: "Gói dịch vụ theo SĐT",
    command: "Tra cứu gói dịch vụ FPT Play {input}",
    example: "Tra cứu gói dịch vụ FPT Play 0339463969",
  },
  {
    id: 7,
    title: "Lịch sử giao dịch theo SĐT",
    command: "Tra cứu lịch sử giao dịch FPT Play {input}",
    example: "Tra cứu lịch sử giao dịch FPT Play 0339463969",
  },
  {
    id: 8,
    title: "Thông tin dịch vụ theo MAC Box",
    command: "Mac thiết bị {input}",
    example: "Mac thiết bị FC5703D98EB0",
  },
  {
    id: 9,
    title: "Thông tin thiết bị BOX theo SĐT",
    command: "Thông tin MAC gắn với {input}",
    example: "Thông tin mac gắn với 0339463969",
  },
  {
    id: 10,
    title: "Thông tin dịch vụ theo HĐ",
    command: "Thông tin MAC của {input}",
    example: "Tra cứu MAC của HĐ HNABE8205",
  },
  {
    id: 11,
    title: "Tìm SĐT sử dụng dịch vụ",
    command: "SĐT FPT Play liên kết với {input}",
    example: "SĐT FPT Play liên kết với SGABH6686",
  },
  {
    id: 12,
    title: "Thông tin kích hoạt gói SA từ MAC box",
    command: "Tra cứu kích hoạt gói 0đ {input}",
    example: "Tra cứu kích hoạt gói 0đ D4CFF95E454C",
  },
];

export const taskQueries: QueryItem[] = [
  {
    id: 1,
    title: "Clear checklist bảo trì tạo sai",
    command: "Clear checklist {input}",
    example: "Clear checklist HNH661487",
  },
  {
    id: 2,
    title: "Clear tín hiệu online NET",
    command: "Clear tín hiệu {input}",
    example: "Clear tín hiệu HNH661487",
  },
  {
    id: 3,
    title: "Lấy QR hỗ trợ kỹ thuật",
    command: "Lấy QR hỗ trợ kỹ thuật {input}",
    example: "Lấy QR hỗ trợ kỹ thuật HNH661487",
  },
];

export const foxStepsFAQQueries: QueryItem[] = [
  {
    id: 1,
    title: "Chưa ghi nhận bước chân?",
    command: "Tại sao FoxSteps không ghi nhận bước chân?",
    example: "Tại sao FoxSteps không ghi nhận bước chân?",
  },
  {
    id: 2,
    title: "Kết nối đồng hồ, thiết bị",
    command:
      "Dùng Garmin, smartwatch hoặc thiết bị khác có được tính bước không?",
    example:
      "Dùng Garmin, smartwatch hoặc thiết bị khác có được tính bước không?",
  },
  {
    id: 3,
    title: "Cách kiểm tra bước trên điện thoại",
    command: "Làm sao kiểm tra số bước trong Apple Health hoặc Health Connect?",
    example: "Làm sao kiểm tra số bước trong Apple Health hoặc Health Connect?",
  },
  {
    id: 4,
    title: "Cách liên kết để ghi nhận bước",
    command:
      "Làm sao để liên kết FoxSteps với Apple Health hoặc Health Connect?",
    example:
      "Làm sao để liên kết FoxSteps với Apple Health hoặc Health Connect?",
  },
  {
    id: 5,
    title: "Vì sao cần mở app FoxSteps?",
    command: "Không mở app Foxsteps có đồng bộ được không?",
    example: "Vì sao cần mở app FoxSteps?",
  },
  {
    id: 6,
    title: "Cài đặt trên Android",
    command: "Điện thoại Android cần cài đặt những gì để ghi nhận bước chân?",
    example: "Điện thoại Android cần cài đặt những gì để ghi nhận bước chân?",
  },
  {
    id: 7,
    title: "Cài đặt trên iPhone",
    command: "iPhone cần làm gì để FoxSteps ghi nhận bước chân?",
    example: "iPhone cần làm gì để FoxSteps ghi nhận bước chân?",
  },
];
