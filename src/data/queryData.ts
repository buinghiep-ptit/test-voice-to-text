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
    title: "Tình trạng HĐ, ngày lên lần đầu, ngày cập nhật tình trạng",
    command: "Tra cứu {input}",
    example: "Tra cứu HNH661487",
  },
  {
    id: 4,
    title:
      "Tiền cước NET trên hóa đơn của hợp đồng (5 hóa đơn gần nhất trong 1 năm)",
    command: "Tra cứu cước NET {input}",
    example: "Tra cứu cước NET HNH661487",
  },
  {
    id: 5,
    title:
      "Tiền thiết bị trên hóa đơn của hợp đồng (5 hóa đơn gần nhất trong 1 năm)",
    command: "Tra cứu tiền thiết bị {input}",
    example: "Tra cứu tiền thiết bị HNH661487",
  },
  {
    id: 6,
    title: "Danh sách phiếu thi công",
    command: "Tra cứu PTC {input}",
    example: "Tra cứu PTC HNH661487",
  },
  {
    id: 7,
    title: "Các lần kết nối NET của hợp đồng",
    command: "Các lần kết nối {input}",
    example: "Các lần kết nối HNH661487",
  },
  {
    id: 8,
    title: "Thông số đầu nhảy/ thông số thi công của hợp đồng",
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
];

export const fptPlayQueries: QueryItem[] = [
  {
    id: 1,
    title: "Danh sách các giải đấu thể thao",
    command: "Các giải đấu thể thao trên FPT Play",
    example: "Các giải đấu thể thao trên FPT Play",
  },
  {
    id: 2,
    title: "Lịch phát sóng của kênh",
    command: "Lịch phát sóng kênh {input}",
    example: "Lịch phát sóng kênh VTV1",
  },
  {
    id: 3,
    title: "Top 10 chương trình độc quyền",
    command: "10 kênh VOD độc quyền",
    example: "10 kênh VOD độc quyền",
  },
  {
    id: 4,
    title: "Top 10 chương trình mới nhất",
    command: "10 kênh VOD mới {input}",
    example: "10 kênh VOD mới phim lẻ",
  },
  {
    id: 5,
    title: "Top 10 chương trình sắp ra mắt",
    command: "10 kênh VOD sắp chiếu {input}",
    example: "10 kênh VOD sắp chiếu phim bộ",
  },
  {
    id: 6,
    title: "Tra cứu gói dịch vụ",
    command: "Tra cứu gói dịch vụ FPT Play {input}",
    example: "Tra cứu gói dịch vụ FPT Play 0339463969",
  },
  {
    id: 7,
    title: "Tra cứu lịch sử giao dịch",
    command: "Tra cứu lịch sử giao dịch FPT Play {input}",
    example: "Tra cứu lịch sử giao dịch FPT Play 0339463969",
  },
  {
    id: 8,
    title: "Thông tin số HĐ, SĐT sử dụng dịch vụ từ MAC box",
    command: "Mac thiết bị {input}",
    example: "Mac thiết bị FC5703D98EB0",
  },
  {
    id: 9,
    title: "Thông tin số HĐ, MAC box, ngày kích hoạt từ SĐT",
    command: "Thông tin MAC gắn với {input}",
    example: "Thông tin mac gắn với 0339463969",
  },
  {
    id: 10,
    title:
      "Thông tin tình trạng tài khoản, SĐT sử dụng dịch vụ, ngày active từ số HĐ",
    command: "Thông tin MAC của {input}",
    example: "Tra cứu MAC của HĐ HNABE8205",
  },
  {
    id: 11,
    title: "Tìm SĐT sử dụng dịch vụ của HĐ và thời gian kích hoạt",
    command: "SĐT FPT Play liên kết với {input}",
    example: "SĐT FPT Play liên kết với SGABH6686",
  },
  {
    id: 12,
    title:
      "Thông tin số HĐ, số điện thoại và ngày kích hoạt gói 0đ của FPT Play SA từ MAC box",
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
    command: "_Chuẩn bị golive_",
    example: "(không có ví dụ cụ thể)",
  },
];
