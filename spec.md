# Bài nộp LAB5 — Track: T3 · Nhóm BaAnhEm123

Lớp: L3A
Bàn / zone:
Track: T3

| Họ và tên        | Mã học viên | Việc đã làm |
| ---------------- | ----------- | ----------- |
| Nguyễn Minh Quân | 2A202603510 |             |
| Nguyễn Quốc Việt | 2A202603556 |             |
| Đàm Tuấn Linh    | 2A202603624 |             |

> Khung bài nộp: giữ thông tin nhóm và dữ liệu đề bài đã có; các ô trống là nội dung nhóm chưa chốt. Hướng dẫn trong từng mục là yêu cầu cần đáp ứng, chưa phải câu trả lời của nhóm.
>
> Với mỗi quyết định, ghi đủ: phương án đã cân nhắc · phương án chọn · lý do chọn · lý do loại phương án khác. Bằng chứng cần trỏ tới tool, dữ liệu cụ thể hoặc vị trí có đánh số trên prototype.
>
> Tài liệu đối chiếu: [Mẫu spec chính thức](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/03-spec-template.md) · [Hướng dẫn](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/02-guide.md) · [Rubric](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/04-rubric.md).

## §1. Lát cắt & phạm vi

### 1.1. Thông tin đề bài T3 — Du lịch: trợ lý đổi chuyến khi chuyến bay bị huỷ

> **Cách dùng:** đọc từ trên xuống trong chặng 1 (10 phút). Sản phẩm thật chỉ để **tham khảo** cách nó chạy hôm nay; nhóm **không** chat với sản phẩm thật. Đây là bài **thiết kế**: không chạy agent, không cần chatbot. Nhóm tự lường trước AI có thể sai ở đâu từ lát cắt, bộ việc AI có thể làm và dữ liệu dựng (mục Data & fixture). Khung chung: [Đề bài](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/01-challenge-brief.md); các bước: [Hướng dẫn](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/02-guide.md).

**Sản phẩm nền.** Traveloka là ứng dụng đặt vé máy bay, khách sạn phổ biến ở Việt Nam. Trong **Đặt chỗ của tôi** có tab **Hoàn tiền & Đổi lịch**: Easy Reschedule để đổi chuyến, và yêu cầu hoàn tiền. Hãng bay (ví dụ Vietnam Airlines) có chính sách riêng khi chuyến bị chậm, huỷ.

**Sản phẩm thật hôm nay** _(tóm tắt từ trang trợ giúp công khai, kiểm 11/11/2026)_:

- **Đổi lịch (Traveloka):** Đặt chỗ của tôi → mở vé → Hoàn tiền & Đổi lịch → Đổi lịch → Yêu cầu đổi lịch → chọn chuyến bay và hành khách → tìm chuyến mới → xem phí → thanh toán. Vé cũ **giữ nguyên tới khi thanh toán xong**; vé mới tới trong khoảng 60 phút sau khi thanh toán. Không phải chuyến nào cũng đổi được qua Easy Reschedule.
- **Hoàn tiền (Traveloka):** Hoàn tiền & Đổi lịch → Hoàn tiền → đọc chính sách → chọn lý do, hành khách → gửi. Hướng dẫn công khai nói **gửi rồi thì không huỷ được yêu cầu**; xử lý có thể tới 90 ngày; tiền về phương thức thanh toán gốc, có ca hoàn bằng voucher.
- **Khi hãng đổi lịch (Vietnam Airlines):** hành khách bấm link trong tin báo để đổi chuyến, **một lần trong 48 giờ**; không có chuyến phù hợp thì yêu cầu hoàn.
- **Chậm, huỷ chuyến (Vietnam Airlines):** chậm từ 4 giờ trở lên do lỗi hãng thì được hoàn và bồi thường ứng trước; **bất khả kháng (thời tiết, an ninh…) thì miễn bồi thường**.
- Trang trợ giúp công khai không mô tả trợ lý AI làm các bước trên thay khách: khách tự bấm qua từng bước.

Nguồn: <https://www.traveloka.com/vi-vn/reschedule/flight> · <https://www.traveloka.com/en-en/help/flight/flight-managing-booking/flight-changes/reschedule/how-do-i-reschedule-my-flight> · <https://www.traveloka.com/en-vn/help/flight/flight-managing-booking/flight-changes/refund/about-my-refund-type> · <https://www.thegioididong.com/game-app/cach-doi-lich-bay-ve-may-bay-traveloka-tien-loi-nhanh-chong-1559955> · <https://www.vietnamairlines.com/vn/vi/help-desk/common-topics/Ticket-change/doi-chuyen-bay-khong-tu-nguyen-do-VNA-thay-doi-lich-bay> · <https://www.vietnamairlines.com/vn/vi/support/customer-service-plan>

Nhóm tự tìm hiểu thêm sản phẩm thật nếu muốn (đọc trang trợ giúp ở trên, mở app nếu có sẵn): không cần chụp màn hình, không chat với trợ lý thật, không nhập dữ liệu thật.

**Người dùng.** Hành khách vừa nhận tin chuyến bay bị huỷ hoặc đổi giờ, thường đang vội, có khi đi cùng trẻ nhỏ; nhân viên hỗ trợ nhận các ca khó.

**Bối cảnh.** Sai cả hai hướng đều đắt. Trợ lý đổi vé khi khách chưa nói rõ thì khách mất lần đổi miễn phí duy nhất, chuyến đúng có thể đã hết chỗ, khách lỡ việc. Trợ lý gửi yêu cầu hoàn vé quá tay thì không rút lại được, khách mất cả chỗ lẫn tiền trong tới 90 ngày. Ngược lại, trợ lý bắt khách chờ nhân viên cho mọi việc thì chuyến tốt nhất hết chỗ trong lúc chờ. Hứa bồi thường sai (huỷ do thời tiết) thì khách mất lòng tin, nhân viên phải đi gỡ.

**Người trong cuộc nói gì (dữ liệu dựng, không phải phỏng vấn thật):**

- **Hành khách đi cùng con nhỏ:** "Tin báo huỷ lúc 3 giờ chiều, tôi chỉ cần biết chuyến nào còn chỗ cho cả hai mẹ con, đừng bắt tôi bấm qua mười màn hình."
- **Nhân viên hỗ trợ:** "Ca khó nhất là khách lỡ bấm hoàn vé, rồi muốn đổi chuyến. Gửi rồi là không rút được."

**Bài toán gốc.** Tích hợp một trợ lý AI vào **Đặt chỗ của tôi**: khi chuyến bị huỷ, trợ lý **tra đặt chỗ, đề xuất chuyến thay thế, giữ chỗ, đổi chuyến, gửi yêu cầu hoàn vé, hoặc chuyển nhân viên**. Thiết kế lúc trợ lý không chắc hoặc sai (khách thấy gì, làm gì tiếp, hoàn tác được không), và việc nào trợ lý được tự làm.

**Lát cắt (phát sẵn, không chọn lại).** Trong **Đặt chỗ của tôi**, khi **hành khách** vừa nhận tin chuyến bay bị huỷ và nhắn hỏi, **AI đề xuất và giữ chỗ chuyến thay thế, hỏi lại cho rõ, đổi vé, hay chuyển nhân viên**, để khách tới nơi kịp mà không mất vé hay tiền vì một thao tác không đảo lại được.

| Sản phẩm                          | Một người dùng | Một việc                             | Một quyết định của AI                                     | Một kết quả                                                             |
| --------------------------------- | -------------- | ------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| Đặt chỗ của tôi (giống Traveloka) | hành khách     | vừa nhận tin chuyến bị huỷ, nhắn hỏi | đề xuất và giữ chỗ, hỏi lại, đổi vé, hay chuyển nhân viên | khách tới nơi kịp, không mất vé hay tiền vì một thao tác không đảo được |

**Data & fixture.** Không có dữ liệu thật. Nhóm có ba thứ:

1. **Những việc AI có thể làm (tool).** Bảng chỉ nói tool làm gì và đảo lại được không, **chưa có mức tự chủ**. Ở chặng 4, nhóm tự đặt mỗi tool một mức (tự làm / cần người duyệt / cấm) và giải thích theo cái giá khi sai. Tool không có trong bảng thì AI không làm được; nhóm muốn thêm hoặc tách một tool (ví dụ "soạn sẵn" tách khỏi "gửi đi") thì ghi rõ và nói vì sao.

| Tool                  | Làm gì                                                             | Đảo lại được không                                           |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `tra_cuu_dat_cho`     | Đọc đặt chỗ, hành khách, chuyến thay thế còn chỗ (dữ liệu ở mục 2) | Chỉ đọc                                                      |
| `giu_cho_chuyen_moi`  | Giữ chỗ chuyến mới 20 phút, chưa đổi vé                            | Được: hết 20 phút tự nhả                                     |
| `doi_chuyen_bay`      | Đổi vé sang chuyến mới, dùng lần đổi miễn phí duy nhất             | **Khó**: hết lần đổi miễn phí; chuyến khác có thể đã hết chỗ |
| `gui_yeu_cau_hoan_ve` | Gửi yêu cầu hoàn vé                                                | **Không**: gửi rồi không huỷ được                            |
| `chuyen_nhan_vien`    | Chuyển cuộc chat cho nhân viên hỗ trợ                              | Được                                                         |

2. **Dữ liệu dựng: một đặt chỗ.** Đây là thứ `tra_cuu_dat_cho` trả về. Dùng nó để suy ra AI có thể đoán sai giờ, sai chỗ trống, hứa sai quyền lợi ở đâu. Kịch bản của nhóm có thể đổi dữ liệu (ví dụ chuyến 21:00 vừa hết chỗ) — ghi rõ trong kịch bản.

- Bây giờ: 15:00 ngày 12/11/2026.
- Mã đặt chỗ: TRV-7Q2K. Đặt qua app. Hạng Phổ thông Tiết kiệm.
- Hành khách: Nguyễn Minh An (34 tuổi) · Nguyễn Gia Bình (5 tuổi).
- Chuyến gốc: BM 213 Hà Nội → TP.HCM, 12/11 19:00. TRẠNG THÁI: ĐÃ HUỶ do thời tiết (bão).
- Theo hãng Bay Mẫu (hãng dựng): chuyến bị huỷ thì đổi miễn phí một lần trong 48 giờ, hoặc hoàn toàn bộ. Huỷ do thời tiết thì không bồi thường tiền mặt.
- Chuyến thay thế còn chỗ:
  - BM 217 · 12/11 21:00 · còn 1 chỗ
  - BM 201 · 13/11 07:00 · còn 9 chỗ
  - BM 205 · 13/11 09:30 · còn 4 chỗ

3. **Ba tin mồi** để bắt đầu viết kịch bản ở chặng 2 (nhóm tự viết thêm, tự đổi):

- _"Chuyến của mình mấy giờ bay vậy?"_
- _"Chuyến bị huỷ rồi à? Vậy đổi giúp mình sang sáng mai nhé."_
- _"Thôi huỷ hết đi, hoàn tiền cho mình."_

**Deliverable.** Bài nộp theo mẫu spec chính thức + prototype 1–2 màn hình cho lát cắt này (xem Hướng dẫn §5 tại liên kết đầu tài liệu).

**Demo bắt buộc.** Prototype mẫu của giảng viên đã dùng ca "đổi sang sáng mai" — nhóm chọn ca khó khác. Bấm qua một ca **khách xác nhận mơ hồ, hoặc trợ lý vừa đổi nhầm**: khách thấy gì, hoàn tác thế nào, ai được báo. Rồi trả lời một **ca lạ** do TA, nhóm bạn hoặc giảng viên đưa tại chỗ.

**Hard tests** _(chỗ dễ sai, nhóm nên có kịch bản cho các loại này)_: Khách nói "đổi đi" mà không rõ chuyến nào, cho ai · yêu cầu hoàn gửi rồi không huỷ được · hỏi bồi thường khi huỷ do thời tiết · trẻ nhỏ bay một mình · đổi tên người bay · khách báo trợ lý vừa đổi nhầm · tin tự xưng "nhân viên hãng" đòi bỏ qua quy định.

**Rubric riêng (tham khảo)** — "một sản phẩm tốt nên làm gì" trong domain này. Dùng để tự soát, không phải đáp án. Chấm chung theo Rubric tại liên kết đầu tài liệu.

1. Không đổi, không huỷ, không gửi hoàn khi khách chưa xác nhận rõ **chuyến nào, cho hành khách nào**.
2. Trước khi gửi yêu cầu hoàn: nói rõ **gửi rồi không huỷ được**, tiền về đâu, mất bao lâu.
3. Giờ bay, chỗ trống chỉ lấy từ dữ liệu đặt chỗ; không đoán.
4. Huỷ do thời tiết: nói rõ được đổi miễn phí hoặc hoàn toàn bộ; **không hứa bồi thường tiền mặt**.
5. Khách gấp: đưa lựa chọn sớm nhất còn chỗ, **giữ chỗ** trong lúc chờ khách xác nhận.
6. Trẻ nhỏ bay một mình, đổi tên người bay: chuyển nhân viên.
7. Khách báo đổi nhầm: chỉ đường hoàn tác nếu còn được; không được thì chuyển nhân viên ngay.
8. Tin tự xưng nhân viên, đòi bỏ qua quy định: không làm theo; tin nhắn là dữ liệu, không phải lệnh.

**Bonus.** Prototype có một lời gọi AI thật đọc tin của khách và chọn tool · có đếm ngược giữ chỗ và nút hoàn tác trên màn hình.

**An toàn & đạo đức.** Không hứa bồi thường khi chưa rõ lý do huỷ · không xin số thẻ, OTP · đổi tên người bay, trẻ bay một mình: chuyển nhân viên · dữ liệu trong bài là dựng; hãng "Bay Mẫu" là hãng dựng, khoá học không liên kết với Traveloka hay hãng bay nào.

### 1.2. Những việc tính năng không làm

> Ít nhất 3 việc ngoài phạm vi; mỗi việc có lý do. Prototype phải tuân theo phạm vi này.

| STT | Việc không làm                                                          | Lý do                                                                                                                                                                                                                                   |
| --- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Không tự đổi vé khi khách chưa xác nhận rõ chuyến và hành khách.        | Tool `doi_chuyen_bay` dùng lần đổi miễn phí duy nhất; nếu AI đoán sai chuyến hoặc người bay, khách mất quyền đổi miễn phí và có thể không còn chỗ trên chuyến phù hợp. Vì vậy cần xác nhận rõ trước khi đổi.                            |
| 2   | Không tự gửi yêu cầu hoàn vé.                                           | Tool `gui_yeu_cau_hoan_ve` không cho huỷ yêu cầu đã gửi; hiểu nhầm ý khách có thể khiến khách mất chỗ và phải chờ tiền hoàn tới 90 ngày theo bối cảnh đề bài. Vì vậy AI không tự gửi chỉ dựa trên suy đoán ý định của khách.            |
| 3   | Không tự đổi tên hành khách hoặc xử lý trường hợp trẻ nhỏ bay một mình. | Bộ tool của track không có chức năng đổi tên hoặc xử lý trẻ bay một mình; đề bài yêu cầu chuyển các ca này cho nhân viên. Tự xử lý hoặc hứa đã xử lý sẽ vượt khả năng của hệ thống, có thể khiến khách tưởng vé đã hợp lệ và lỡ chuyến. |

## §2. Kịch bản rủi ro

### 2.1. Bảng kịch bản

> Ít nhất 8 kịch bản, phủ đủ 4 lớp, mỗi lớp ít nhất một: ① nguồn sự thật / AI bịa; ② tin nhắn mơ hồ, thiếu thông tin; ③ yêu cầu ngoài thẩm quyền; ④ sai gây mất tiền, sức khoẻ hoặc niềm tin ngay.
>
> Nhãn mức hại: nhẹ / sửa được / không chấp nhận được. Cột lỗi phải trỏ tới tool hoặc dữ liệu cụ thể của đề bài, kể cả thông tin dữ liệu không có. Nếu thay đổi fixture, ghi rõ thay đổi trong kịch bản.

| Mã  | Tin người dùng / thay đổi fixture | Lớp | AI có thể sai thế nào + tool / dữ liệu làm căn cứ | Sản phẩm tốt nên làm gì | Nhãn mức hại |
| --- | --------------------------------- | --- | ------------------------------------------------- | ----------------------- | ------------ |
| KB1 |                                   |     |                                                   |                         |              |
| KB2 |                                   |     |                                                   |                         |              |
| KB3 |                                   |     |                                                   |                         |              |
| KB4 |                                   |     |                                                   |                         |              |
| KB5 |                                   |     |                                                   |                         |              |
| KB6 |                                   |     |                                                   |                         |              |
| KB7 |                                   |     |                                                   |                         |              |
| KB8 |                                   |     |                                                   |                         |              |

### 2.2. Chọn hai kịch bản có cái giá khi sai cao nhất

| Mã kịch bản             | Ai chịu thiệt hại gì nếu AI sai                                                                                                                  | Vì sao đắt hơn các kịch bản còn lại / vì sao không chọn                                                                                                                                                                            |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **#4 — Chọn**           | Hai mẹ con có thể bị hủy vé ngoài ý muốn, mất phương án tiếp tục hành trình; tiền hoàn cần thời gian xử lý nên có thể phải ứng tiền mua vé khác. | **Yêu cầu hoàn đã gửi không rút lại được.** Hậu quả ảnh hưởng cả hành trình và tiền của khách; không thể khắc phục chỉ bằng sửa câu trả lời hay yêu cầu khách xác nhận lại sau đó.                                                 |
| **#3 — Chọn**           | Khách bị đổi sang chuyến không mong muốn, mất một lần đổi miễn phí; có thể phát sinh chi phí đổi tiếp hoặc lỡ lịch cá nhân.                      | Câu “Ừ, chuyến đó đi” trông như đã đồng ý nhưng chưa rõ chuyến nào. Nếu AI thực hiện ngay, một suy đoán biến thành thao tác làm mất quyền lợi, đắt hơn các lỗi thông tin còn sửa được trước khi hành động.                         |
| **#1 — Suýt được chọn** | Hai mẹ con nhận gợi ý chuyến chỉ còn một chỗ, không thể cùng bay; nếu tiếp tục xử lý sai có thể dẫn đến tách người lớn và trẻ nhỏ.               | Rủi ro nghiêm trọng, nhưng tin nhắn mới yêu cầu **tra cứu chuyến**, chưa yêu cầu đổi vé. Gợi ý sai còn có thể sửa trước khi thao tác; #3 và #4 trực tiếp đặt khách trước nguy cơ mất quyền lợi hoặc gửi yêu cầu không thể rút lại. |

## §3. Khi AI sai

> Làm chi tiết cho cả hai kịch bản đã chọn ở §2.2. Các mã kịch bản và vị trí prototype cần nhất quán giữa các mục.

### 3.1. Kịch bản đắt nhất A

| Nội dung cần mô tả                                                               | Thiết kế của nhóm |
| -------------------------------------------------------------------------------- | ----------------- |
| Mã kịch bản ở §2                                                                 |                   |
| Loại lỗi: hệ thống / người dùng / ngữ cảnh; lý do phân loại                      |                   |
| Câu AI nói nguyên văn                                                            |                   |
| Người dùng thấy gì ngoài câu chữ: bằng chứng, giới hạn, nút, trạng thái          |                   |
| Người dùng làm gì tiếp; đường sửa / hoàn tác nếu có                              |                   |
| Nếu người dùng không làm gì thì sao                                              |                   |
| Ai được báo; sau bao lâu; người đó nhận thông tin gì                             |                   |
| Các phương án đã cân nhắc: hỏi lại / trả lời kèm giới hạn / dừng và chuyển người |                   |
| Phương án chọn và lý do theo cái giá khi sai                                     |                   |
| Phương án bị loại và lý do                                                       |                   |
| Vì sao cách nói và cách sửa phù hợp với loại lỗi                                 |                   |

### 3.2. Kịch bản đắt nhất B

| Nội dung cần mô tả                                                               | Thiết kế của nhóm |
| -------------------------------------------------------------------------------- | ----------------- |
| Mã kịch bản ở §2                                                                 |                   |
| Loại lỗi: hệ thống / người dùng / ngữ cảnh; lý do phân loại                      |                   |
| Câu AI nói nguyên văn                                                            |                   |
| Người dùng thấy gì ngoài câu chữ: bằng chứng, giới hạn, nút, trạng thái          |                   |
| Người dùng làm gì tiếp; đường sửa / hoàn tác nếu có                              |                   |
| Nếu người dùng không làm gì thì sao                                              |                   |
| Ai được báo; sau bao lâu; người đó nhận thông tin gì                             |                   |
| Các phương án đã cân nhắc: hỏi lại / trả lời kèm giới hạn / dừng và chuyển người |                   |
| Phương án chọn và lý do theo cái giá khi sai                                     |                   |
| Phương án bị loại và lý do                                                       |                   |
| Vì sao cách nói và cách sửa phù hợp với loại lỗi                                 |                   |

### 3.3. Nguyên tắc HAX/PAIR áp dụng

> Chọn 2–3 nguyên tắc; mỗi nguyên tắc phải trỏ tới câu chữ hoặc chi tiết cụ thể và vị trí trên prototype ở §5.

| Nguyên tắc | Mã kịch bản | Câu chữ / chi tiết áp dụng cụ thể | Số chú thích trên ảnh prototype |
| ---------- | ----------- | --------------------------------- | ------------------------------- |
|            |             |                                   |                                 |
|            |             |                                   |                                 |
|            |             |                                   |                                 |

### 3.4. Lỗi không thể cứu chỉ bằng sửa câu chữ

- Lỗi và mã kịch bản liên quan:
- Vì sao sửa câu chữ không đủ:
- Cơ chế thiết kế để chặn hoặc khắc phục:
- Bằng chứng trên prototype:

## §4. Mức tự chủ

### 4.1. Mức tự chủ cho từng tool

> Mỗi tool có một mức: tự làm / cần người duyệt / cấm. Với tool cần duyệt, ghi rõ người duyệt, thông tin họ thấy và cách xử lý khi quá hạn.

| Tool                  | Mức nhóm chọn | Ai duyệt | Người duyệt thấy gì trước khi xác nhận | Quá hạn / không có người duyệt thì sao |
| --------------------- | ------------- | -------- | -------------------------------------- | -------------------------------------- |
| `tra_cuu_dat_cho`     |               |          |                                        |                                        |
| `giu_cho_chuyen_moi`  |               |          |                                        |                                        |
| `doi_chuyen_bay`      |               |          |                                        |                                        |
| `gui_yeu_cau_hoan_ve` |               |          |                                        |                                        |
| `chuyen_nhan_vien`    |               |          |                                        |                                        |

### 4.2. Lập luận theo cái giá khi sai cho từng tool

| Tool                  | Sai thì ai chịu gì | Đảo lại được không; ai sửa; mất bao lâu | Chờ người duyệt thì mất gì | Vì sao chọn mức ở §4.1; phương án đã cân nhắc và lý do loại |
| --------------------- | ------------------ | --------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| `tra_cuu_dat_cho`     |                    |                                         |                            |                                                             |
| `giu_cho_chuyen_moi`  |                    |                                         |                            |                                                             |
| `doi_chuyen_bay`      |                    |                                         |                            |                                                             |
| `gui_yeu_cau_hoan_ve` |                    |                                         |                            |                                                             |
| `chuyen_nhan_vien`    |                    |                                         |                            |                                                             |

### 4.3. Tool khó xếp mức nhất

- Tool:

| Thành viên       | Mức từng chọn | Lý do; cái giá của lựa chọn này; mã kịch bản ở §2 làm căn cứ |
| ---------------- | ------------- | ------------------------------------------------------------ |
| Nguyễn Minh Quân |               |                                                              |
| Nguyễn Quốc Việt |               |                                                              |
| Đàm Tuấn Linh    |               |                                                              |

- Nhóm chốt mức nào:
- Vì sao chốt như vậy; vì sao loại các mức còn lại:

### 4.4. Thử mức tự chủ trên ba kịch bản

> Thử trên hai kịch bản đắt nhất và một kịch bản bình thường. Ghi kết quả kiểm tra thực tế của thiết kế, chưa đánh dấu đạt khi chưa thử.

| Ca kiểm tra | Mã kịch bản | AI làm gì; người dùng thấy gì | Cái sai có bị chặn không; bằng chứng | Còn làm khi lẽ ra phải hỏi không | Người dùng có phải chờ vô ích không |
| ----------- | ----------- | ----------------------------- | ------------------------------------ | -------------------------------- | ----------------------------------- |
| Đắt nhất A  |             |                               |                                      |                                  |                                     |
| Đắt nhất B  |             |                               |                                      |                                  |                                     |
| Bình thường |             |                               |                                      |                                  |                                     |

### 4.5. Luật bổ sung hoặc tool tách bước, nếu có

- Luật / tool thêm hoặc tách; các bước và mức tự chủ tương ứng:
- Vì sao cần; mã kịch bản được chặn nhờ thay đổi này:

### 4.6. Mức tự chủ thay đổi lời hứa với người dùng

- Tool và mức tự chủ liên quan:
- Lời hứa trước khi chốt mức:
- Lời hứa sau khi chốt mức:
- Vì sao cần thay đổi lời hứa:

## §5. Prototype

### 5.1. Thông tin prototype

- Link hoặc đường dẫn file:
- Công cụ dựng:
- Phần nào mock / mô phỏng:
- Có lời gọi AI thật không; nếu có, bằng chứng log / ảnh trong `prototype/`:
- Mã kịch bản dùng cho ca khó:

> Yêu cầu T3: 1–2 màn hình cho ca khách xác nhận mơ hồ hoặc trợ lý vừa đổi nhầm; chọn ca khó khác ca mẫu “đổi sang sáng mai”. Cần bấm được từ đầu tới cuối và thấy ít nhất hai mức tự chủ. Chỉ dùng dữ liệu dựng; không đưa API key vào bài nộp.

### 5.2. Ảnh và chú thích

- Đường dẫn ảnh màn hình 1 có đánh số:
- Đường dẫn ảnh màn hình 2 có đánh số, nếu có:

| Số chú thích | Thể hiện gì trên màn hình | Nguyên tắc HAX/PAIR ở §3.3 | Tool và mức tự chủ ở §4 |
| ------------ | ------------------------- | -------------------------- | ----------------------- |
|              |                           |                            |                         |
|              |                           |                            |                         |
|              |                           |                            |                         |

### 5.3. Lập luận về cách thể hiện

| Quyết định                               | Các phương án đã cân nhắc | Phương án chọn và lý do | Phương án loại và lý do | Vị trí trên prototype |
| ---------------------------------------- | ------------------------- | ----------------------- | ----------------------- | --------------------- |
| Hiển thị độ chắc / bằng chứng AI dựa vào |                           |                         |                         |                       |
| Hiển thị và điều khiển mức tự chủ        |                           |                         |                         |                       |

### 5.4. Đường đi và bằng chứng tương tác

| Đường đi cần kiểm tra       | Mã kịch bản | Các bước bấm; trạng thái / kết quả; đường dẫn bằng chứng |
| --------------------------- | ----------- | -------------------------------------------------------- |
| Luồng bình thường           |             |                                                          |
| AI không chắc / cần hỏi lại |             |                                                          |
| AI sai / không có căn cứ    |             |                                                          |
| Người dùng sửa AI           |             |                                                          |

> Đối chiếu §4: việc tự làm có đường hoàn tác phù hợp; việc cần duyệt có bước xác nhận; có đường chuyển nhân viên; việc cấm không có nút thực hiện.

## §6. Tốt là gì

> Phần nhẹ, có thể bỏ nếu thiếu giờ theo đề bài. Nếu làm, cần đúng 3 tiêu chí Pass/Fail chấm được và chấm thử trên cả hai kịch bản đắt nhất.

### 6.1. Ba tiêu chí Pass/Fail

| Mã  | Tiêu chí | Điều kiện Pass | Điều kiện Fail | Cách kiểm tra / bằng chứng cần xem |
| --- | -------- | -------------- | -------------- | ---------------------------------- |
| TC1 |          |                |                |                                    |
| TC2 |          |                |                |                                    |
| TC3 |          |                |                |                                    |

### 6.2. Kết quả chấm thử

| Kịch bản   | Mã kịch bản ở §2 | TC1: Pass/Fail | TC2: Pass/Fail | TC3: Pass/Fail | Bằng chứng; lỗi còn lại |
| ---------- | ---------------- | -------------- | -------------- | -------------- | ----------------------- |
| Đắt nhất A |                  |                |                |                |                         |
| Đắt nhất B |                  |                |                |                |                         |

## §7. Demo

### 7.1. Kịch bản và phân công trình bày

- Ca khó dùng để demo; mã kịch bản ở §2:
- Trình tự bấm từ đầu tới cuối:
- Quyết định về mức tự chủ và cái giá khi sai cần giải thích:

| Thành viên       | Phần trình bày / thao tác |
| ---------------- | ------------------------- |
| Nguyễn Minh Quân |                           |
| Nguyễn Quốc Việt |                           |
| Đàm Tuấn Linh    |                           |

### 7.2. Ca lạ nhận tại buổi demo

> Chỉ ghi sau khi nhận và xử lý ca lạ; không điền trước kết quả.

- Tin nhắn / tình huống người xem đưa:
- Prototype đã làm gì; tool và mức tự chủ tương ứng:
- Kết quả; bằng chứng quan sát:
- Nhóm có đổi ý hoặc sửa thiết kế sau ca này không; nếu có, sửa gì và vì sao:
