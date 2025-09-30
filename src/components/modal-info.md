# Tra cứu Thông tin KH

| STT | Nội dung cần tra cứu                                                     | Câu lệnh + Ví dụ                                                                    |
| --- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 1   | Tìm thông tin HĐ từ SĐT                                                  | Tra cứu sdt {Số ĐT} → Ví dụ: Tra cứu sdt 0366339889                                 |
| 2   | Kiểm tra trùng KHTN từ SĐT                                               | Kiểm tra trùng KHTN {Số ĐT} → Ví dụ: Kiểm tra trùng KHTN 0366339889                 |
| 3   | Tình trạng HĐ, ngày lên lần đầu, ngày cập nhật tình trạng                | Tra cứu {số HĐ} → Ví dụ: Tra cứu HNH661487                                          |
| 4   | Tiền cước NET trên hóa đơn của hợp đồng (5 hóa đơn gần nhất trong 1 năm) | Tra cứu cước NET {số HĐ} → Ví dụ: Tra cứu cước NET HNH661487                        |
| 5   | Tiền thiết bị trên hóa đơn của hợp đồng (5 hóa đơn gần nhất trong 1 năm) | Tra cứu tiền thiết bị {số HĐ} → Ví dụ: Tra cứu tiền thiết bị HNH661487              |
| 6   | Danh sách phiếu thi công                                                 | Tra cứu PTC {số HĐ} → Ví dụ: Tra cứu PTC HNH661487                                  |
| 7   | Các lần kết nối NET của hợp đồng                                         | Các lần kết nối {số HĐ} → Ví dụ: Các lần kết nối HNH661487                          |
| 8   | Thông số đầu nhảy/ thông số thi công của hợp đồng                        | Thông số đầu nhảy HĐ {số HĐ} → Ví dụ: Thông số đầu nhảy HĐ HNH661487                |
| 9   | Chi nhánh quản lý hợp đồng                                               | Chi nhánh quản lý {số HĐ} → Ví dụ: Chi nhánh quản lý HNH661487                      |
| 10  | Thông tin số tài khoản ngân hàng của CN                                  | Số tài khoản chi nhánh {tên viết tắt chi nhánh} → Ví dụ: Số tài khoản chi nhánh HPG |

# Câu lệnh tra cứu dịch vụ FPT Play

| STT | Nội dung cần tra cứu                                                               | Câu lệnh + Ví dụ                                                                                  |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Danh sách các giải đấu thể thao                                                    | Các giải đấu thể thao trên FPT Play → Ví dụ: Các giải đấu thể thao trên FPT Play                  |
| 2   | Lịch phát sóng của kênh                                                            | Lịch phát sóng kênh {tên kênh} → Ví dụ: Lịch phát sóng kênh VTV1                                  |
| 3   | Top 10 chương trình độc quyền                                                      | 10 kênh VOD độc quyền → Ví dụ: 10 kênh VOD độc quyền                                              |
| 4   | Top 10 chương trình mới nhất                                                       | 10 kênh VOD mới {thể loại} → Ví dụ: 10 kênh VOD mới phim lẻ                                       |
| 5   | Top 10 chương trình sắp ra mắt                                                     | 10 kênh VOD sắp chiếu {thể loại} → Ví dụ: 10 kênh VOD sắp chiếu phim bộ                           |
| 6   | Tra cứu gói dịch vụ                                                                | Tra cứu gói dịch vụ FPT Play {Số ĐT} → Ví dụ: Tra cứu gói dịch vụ FPT Play 0339463969             |
| 7   | Tra cứu lịch sử giao dịch                                                          | Tra cứu lịch sử giao dịch FPT Play {Số ĐT} → Ví dụ: Tra cứu lịch sử giao dịch FPT Play 0339463969 |
| 8   | Thông tin số HĐ, SĐT sử dụng dịch vụ từ MAC box                                    | Mac thiết bị {số MAC} → Ví dụ: Mac thiết bị FC5703D98EB0                                          |
| 9   | Thông tin số HĐ, MAC box, ngày kích hoạt từ SĐT                                    | Thông tin MAC gắn với {Số ĐT} → Ví dụ: Thông tin mac gắn với 0339463969                           |
| 10  | Thông tin tình trạng tài khoản, SĐT sử dụng dịch vụ, ngày active từ số HĐ          | Thông tin MAC của {số HĐ} → Ví dụ: Tra cứu MAC của HĐ HNABE8205                                   |
| 11  | Tìm SĐT sử dụng dịch vụ của HĐ và thời gian kích hoạt                              | SĐT FPT Play liên kết với {số HĐ} → Ví dụ: SĐT FPT Play liên kết với SGABH6686                    |
| 12  | Thông tin số HĐ, số điện thoại và ngày kích hoạt gói 0đ của FPT Play SA từ MAC box | Tra cứu kích hoạt gói 0đ {số MAC} → Ví dụ: Tra cứu kích hoạt gói 0đ D4CFF95E454C                  |

# Câu lệnh xử lý tác vụ

| STT | Nội dung cần thực hiện          | Câu lệnh + Ví dụ                                           |
| --- | ------------------------------- | ---------------------------------------------------------- |
| 1   | Clear checklist bảo trì tạo sai | Clear checklist {số HĐ} → Ví dụ: Clear checklist HNH661487 |
| 2   | Clear tín hiệu online NET       | _Chuẩn bị golive_ → (không có ví dụ cụ thể)                |
