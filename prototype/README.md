# Prototype — Bay cùng bạn

Mô phỏng track T3 cho nhóm BaAnhEm123. Mở **[index.html](index.html)** bằng Chrome hoặc Edge; giữ `index.html`, `style.css`, `app.js` và `simulator.js` cùng thư mục. Không cần cài thư viện, backend hoặc API key. Có thể mở trực tiếp bằng `file://`.

## Chế độ và giới hạn

- **Theo spec:** tra cứu và chuyển ca bắt buộc tự làm; giữ chỗ, đổi chuyến và gửi hoàn cần khách duyệt. Dùng chế độ này để kiểm tra §4.4.
- **Tự làm:** đối chứng chỉ thay quyền `doi_chuyen_bay`. AI tự chọn phương án khi khách nói mơ hồ; sau khi khách duyệt giữ chỗ, AI đổi luôn, không có xác nhận đổi cuối. Đây là ví dụ rủi ro, không phải cấu hình được đề xuất trong spec.
- **Cần duyệt:** quyền đổi chuyến trùng mức đã chọn trong spec; phải xác nhận cuối.
- **Cấm:** AI không gọi tool đổi chuyến, không có nút đổi, chuyển nhân viên. Tra cứu/giữ chỗ vẫn theo quyền trong spec.

Đổi chế độ hoặc bấm **Làm lại ca** sẽ bắt đầu phiên mới, xoá hội thoại, nhật ký và fixture bổ sung của phiên cũ. Xuất JSON trước nếu muốn giữ bằng chứng.

Toàn bộ chatbot, nhân viên, dữ liệu và tool đều là mô phỏng trong trình duyệt. Chatbot dùng từ khoá tiếng Việt, không hiểu mọi cách diễn đạt như mô hình AI thật. Không có lời gọi mạng, giao dịch, email hay vé thật. Chỉ dùng dữ liệu dựng, không nhập thông tin cá nhân thật.

Mốc giờ và chuyến dùng fixture ngày 12–13/11/2026. Đồng hồ giữ chỗ chạy 20 phút từ lúc bấm giữ; công cụ kiểm thử cho phép làm hết hạn ngay. Kho chỗ chỉ được mô phỏng trong một phiên, không phải hệ thống tồn chỗ giữa nhiều người dùng.

## Kiểm tra §4.4 trên giao diện

Mỗi ca chọn **Theo spec**, bấm **Làm lại ca**, rồi thao tác từ đầu. Một người ngoài nhóm có thể bấm thử mà không cần sửa code hoặc can thiệp trạng thái giữa luồng.

| Ca | Thao tác | Kết quả cần quan sát |
| --- | --- | --- |
| #3, xác nhận mơ hồ | Bấm tin mẫu #3; chọn BM 201 và cả hai hành khách; bấm giữ. Thử tiến tới đổi trước khi tích xác nhận, rồi tích xác nhận và bấm đổi. | Ban đầu chưa tự chọn/giữ/đổi. Sau giữ vẫn **Chưa đổi vé**. Chỉ đổi khi có giữ còn hiệu lực và khách xác nhận cuối. Nhật ký chỉ có một lần `doi_chuyen_bay` thành công. |
| #4, hoàn vé thiếu dữ liệu | Bấm tin mẫu #4. | Hiện **Chưa gửi**, nút gửi và xác nhận bị khoá; có `chuyen_nhan_vien`, không có `gui_yeu_cau_hoan_ve` đã chạy. Không tự điền thời gian/phương thức hoàn. |
| #1, tra cứu bình thường | Bấm tin mẫu #1. | Đề xuất BM 201 đủ cho hai mẹ con; BM 217 không đủ hai chỗ. Nhật ký chỉ tra cứu, không tự giữ/đổi và không chuyển nhân viên vô ích. |

### Ca biên

- **Hết hạn:** giữ BM 201, tích xác nhận, mở **Công cụ kiểm thử** và bấm **Cho giữ chỗ hết hạn ngay**. Nút đổi và xác nhận cũ mất hiệu lực; phải giữ và xác nhận lại. Nhật ký ghi đây là thay đổi thời gian giả lập.
- **Đổi lựa chọn:** giữ BM 201 rồi chọn BM 205 hoặc thay hành khách. Xác nhận cũ không áp dụng; chỗ cũ không được hứa nhả tức thì.
- **Không đủ chỗ:** chọn BM 217 cho hai người và bấm giữ. Tool bị chặn, chưa có giữ/đổi thành công.
- **Trẻ bay một mình:** bỏ chọn người lớn rồi thử giữ cho trẻ. Không giữ/đổi; chuyển nhân viên.
- **Dữ liệu chỗ thay đổi:** bấm **Giả lập BM 201 hết chỗ**. Đây là tình huống kiểm thử làm mất hiệu lực giữ BM 201, không phải diễn biến thật của hãng. Lựa chọn và xác nhận cũ không cho phép đổi.
- **Tin tự xưng nhân viên:** dùng nút kiểm thử. Nội dung tin không bỏ được xác nhận ở chế độ Theo spec.
- **Đã đổi/gửi nhầm:** sau thao tác thành công, bấm **Báo thao tác sai**. Hiển thị trạng thái thực tế và chuyển hỗ trợ; không xuất hiện nút hoàn tác giả.

### Thử phần gửi hoàn khi đã có thông tin

Fixture gốc chưa có thời gian và phương thức hoàn nên nhánh này phải dừng. Để thử nhánh sau, người demo có thể tự nhập **cả hai** thông tin ở **Thông tin hoàn GIẢ ĐỊNH** trong Công cụ kiểm thử. Những giá trị này được gắn nhãn giả định trên giao diện và nhật ký, không ghi nhận là chính sách đã được nhân viên thật kiểm tra.

Nạp thông tin không tự gửi hoặc tự xác nhận. Khách phải chọn hành khách, đọc cảnh báo, tích xác nhận và bấm gửi. Sau gửi không có hoàn tác; làm lại ca để xoá fixture giả định.

## HAX/PAIR và bằng chứng

- **① G10:** hỏi lại và chặn thực thi khi thiếu thông tin/xác nhận.
- **② G2:** nêu giới hạn số chỗ, trạng thái thao tác và dữ liệu hoàn chưa có.
- **③ G8:** bỏ bước đề xuất trước thao tác, không buộc tiếp tục với lựa chọn AI.
- **④ PAIR Errors + Graceful Failure:** chuyển người và nói rõ khả năng khắc phục.

Các nhãn trong hội thoại liên kết tới phần giải thích tương ứng. Dùng công tắc chú thích để bật/tắt chúng. Số chú thích trên ảnh có thể dùng cùng các ký hiệu này.

Ảnh nhóm cung cấp ở chế độ **Theo spec**:

- [Ca khó #3 — xác nhận mơ hồ](ca_kho_%233.png): hỏi lại chuyến và hành khách, chưa giữ/chưa đổi.
- [Ca khó #4 — hoàn vé thiếu dữ liệu](ca_kho_%234.png): chưa gửi, cảnh báo không thể huỷ và chuyển hỗ trợ mô phỏng.

Hai ảnh được cắt vào vùng hội thoại/lựa chọn; chưa bao gồm thanh chọn chế độ, toàn bộ nút xác nhận, đồng hồ hoặc nhật ký. Phần chú thích và giới hạn bằng chứng được ghi tại `spec.md` §4.4 và §5. Kết quả 12 kiểm tra logic được lưu trong [verification.txt](verification.txt).

Sau mỗi ca, lưu ảnh hoặc video màn hình và bấm **Xuất JSON** để lấy mode, hội thoại, trạng thái, tool đã chạy/bị chặn, dữ liệu giả định và thời điểm xuất. File xuất chỉ có giá trị cho phiên mô phỏng, không chứng minh hãng hoặc AI thật đã thực hiện hành động.

Khi cập nhật §4.4, ghi người thử, ngày thử, thao tác, kết quả mong đợi, kết quả quan sát, Pass/Fail và đường dẫn ảnh/video/JSON. Không ghi đã kiểm thử giao diện chỉ từ bảng mô tả hoặc kiểm tra mã.

## Kiểm tra logic tự động

Từ thư mục gốc repo:

```powershell
node prototype/self-test.cjs
```

Kiểm tra chạy trực tiếp bộ mô phỏng mà giao diện sử dụng: điều kiện duyệt, hết hạn, thay lựa chọn, thiếu dữ liệu hoàn, không đủ chỗ, trẻ bay một mình, chống gọi lặp và các mức so sánh. Không cần cài package.

Kiểm tra này chứng minh hành vi logic mô phỏng. Hai ảnh nhóm cung cấp bổ sung bằng chứng giao diện tại bước hỏi lại và dừng gửi/chuyển hỗ trợ; chưa phải video bấm hết luồng hoặc bằng chứng mọi nút hoạt động. Việc kiểm tra trình duyệt tự động trước đó dừng vì Computer Use không xác định được URL Chrome đủ tin cậy; không tính đó là một lần kiểm thử giao diện đã đạt.

## File

- `index.html`, `style.css`: giao diện, bố cục co giãn theo màn hình.
- `simulator.js`: trạng thái và chốt kiểm tra trước khi tool mô phỏng chạy.
- `app.js`: nối giao diện, chatbot, đồng hồ và xuất bằng chứng với bộ mô phỏng.
- `self-test.cjs`: kiểm tra logic bằng Node.js.

Tham khảo ý tưởng so sánh mức từ `../sample.html`; không dùng giả định hoàn tác vé, thời gian nhân viên chờ hay chính sách hoàn tiền chưa có trong spec.
