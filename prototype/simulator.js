(function (root) {
  'use strict';
  const flights = [
    { id: 'BM 217', date: '12/11/2026', time: '21:00', seats: 1 },
    { id: 'BM 201', date: '13/11/2026', time: '07:00', seats: 9 },
    { id: 'BM 205', date: '13/11/2026', time: '09:30', seats: 4 }
  ];
  const passengers = [
    { id: 'adult', name: 'Nguyễn Minh An', detail: '34 tuổi' },
    { id: 'child', name: 'Nguyễn Gia Bình', detail: '5 tuổi' }
  ];
  const modes = {
    spec: { name: 'Theo spec', level: 'Cần người duyệt', promise: 'Mình tra và đề xuất; bạn duyệt giữ chỗ rồi xác nhận cuối trước khi đổi vé.', note: 'Mức nhóm đề xuất ở §4.1. Chạy các ca §4.4 tại đây.' },
    auto: { name: 'Tự làm', level: 'Tự làm', promise: 'Sau khi bạn duyệt giữ chỗ, mình tự đổi chuyến, không chờ xác nhận cuối.', note: 'ĐỐI CHỨNG RỦI RO · Chỉ đổi mức của doi_chuyen_bay. Có thể dùng mất lần đổi miễn phí khi khách chưa chốt ý. Không có hoàn tác giả.' },
    ask: { name: 'Cần duyệt', level: 'Cần người duyệt', promise: 'Bạn chọn chuyến, duyệt giữ chỗ và xác nhận bản tóm tắt; mình mới đổi vé.', note: 'Chế độ so sánh này trùng mức đổi chuyến đã chọn trong spec.' },
    ban: { name: 'Cấm', level: 'Cấm', promise: 'Mình hỗ trợ tra và giữ theo lựa chọn của bạn; việc đổi vé được chuyển nhân viên.', note: 'SO SÁNH · AI không được gọi doi_chuyen_bay, kể cả khi khách đã xác nhận. Có thể làm tăng thời gian chờ.' }
  };
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd');
  function createDemo(mode = 'spec') {
    if (!modes[mode]) mode = 'spec';
    const state = { mode, intent: 'info', selected: '', people: ['adult', 'child'], recommendation: '', bookingFlight: 'BM 213', bookingPeople: [], holds: [], approved: false, approvalKey: '', exchanged: false, refunded: false, staff: false, refundInfo: null, inventory: Object.fromEntries(flights.map(f => [f.id, f.seats])), messages: [], logs: [], lastNotice: '' };
    function say(text, hax = []) { state.messages.push({ role: 'ai', text, hax }); }
    function log(tool, result, reason, data = {}) { state.logs.push({ id: state.logs.length + 1, at: new Date().toISOString(), tool, result, reason, data }); }
    function blocked(tool, reason) { log(tool, 'blocked', reason); state.lastNotice = reason; say(reason, ['G10']); return false; }
    function key() { return [state.intent, state.selected, ...state.people].join(':'); }
    function activeHold() { return state.holds.find(h => h.key === key() && h.expiresAt > Date.now() && !h.used); }
    function available(id) { return state.inventory[id] - state.holds.filter(h => h.flight === id && h.expiresAt > Date.now() && !h.used).reduce((sum, h) => sum + h.people.length, 0); }
    function lookup() {
      log('tra_cuu_dat_cho', 'executed', 'Đọc fixture TRV-7Q2K; chưa giữ hoặc đổi.', { seats: { ...state.inventory } });
      state.recommendation = flights.find(f => available(f.id) >= Math.max(state.people.length, 1))?.id || '';
    }
    function handoff(reason = 'Khách yêu cầu hỗ trợ') {
      if (!state.staff) log('chuyen_nhan_vien', 'executed', reason, { booking: 'TRV-7Q2K', currentFlight: state.bookingFlight, people: [...state.people] });
      state.staff = true;
      say(`Đã chuyển hỗ trợ (mô phỏng): ${reason}. Nhân viên nhận đặt chỗ, hành khách, hội thoại và lịch sử thao tác. Chưa có cam kết thời gian phản hồi; chuyển ca không khôi phục vé hay rút yêu cầu hoàn.`, ['PAIR']);
      return true;
    }
    function select(flight, people) {
      if (flight && !flights.some(f => f.id === flight)) return blocked('kiểm tra lựa chọn', 'Mã chuyến không có trong fixture.');
      if (!Array.isArray(people) || people.some(p => !passengers.some(known => known.id === p))) return blocked('kiểm tra lựa chọn', 'Hành khách không có trong đặt chỗ.');
      const before = key();
      state.selected = flight;
      state.people = [...new Set(people)].sort();
      if (key() !== before) { state.approved = false; state.approvalKey = ''; state.lastNotice = 'Lựa chọn đã thay đổi. Cần kiểm tra và xác nhận lại; chỗ cũ vẫn tự nhả khi hết hạn.'; }
      return true;
    }
    function hold() {
      if (state.exchanged || state.refunded) return blocked('giu_cho_chuyen_moi', 'Đặt chỗ đã có thao tác hoàn/đổi; không tiếp tục giữ trong ca này.');
      if (state.intent !== 'exchange' || !state.selected || !state.people.length) return blocked('giu_cho_chuyen_moi', 'Chọn rõ chuyến và hành khách trước khi duyệt giữ chỗ.');
      if (state.people.length === 1 && state.people[0] === 'child') { blocked('giu_cho_chuyen_moi', 'Trẻ 5 tuổi bay một mình phải chuyển nhân viên, không tự giữ/đổi.'); handoff('Trẻ nhỏ bay một mình'); return false; }
      if (activeHold()) { say('Lựa chọn này đã được giữ. Thời hạn không được tự gia hạn khi bấm lại.'); return true; }
      lookup();
      if (available(state.selected) < state.people.length) return blocked('giu_cho_chuyen_moi', 'Không đủ chỗ cho các hành khách đã chọn. Chưa giữ và chưa đổi; vui lòng chọn phương án khác.');
      state.holds.push({ key: key(), flight: state.selected, people: [...state.people], expiresAt: Date.now() + 20 * 60 * 1000, used: false });
      state.approved = false;
      log('giu_cho_chuyen_moi', 'executed', 'Khách đã bấm duyệt giữ 20 phút; chưa đổi vé.', { flight: state.selected, people: [...state.people] });
      say(`Đã giữ ${state.selected} cho ${state.people.length} hành khách trong 20 phút (mô phỏng). Chưa đổi vé, chưa dùng lần đổi miễn phí.`, ['G2', 'G8']);
      if (state.mode === 'auto') {
        say('Chế độ đối chứng Tự làm: AI sẽ đổi ngay, dù bạn chỉ vừa duyệt giữ chỗ và chưa xác nhận đổi. Đây là rủi ro cần quan sát.');
        return exchange();
      }
      return true;
    }
    function approve(value) {
      state.approved = false; state.approvalKey = '';
      if (!value) return false;
      if (state.intent === 'refund') {
        if (!state.refundInfo || !state.people.length) return blocked('kiểm tra xác nhận', 'Chưa đủ thông tin hoàn hoặc chưa chọn hành khách; không thể xác nhận gửi.');
      } else if (state.intent !== 'exchange' || !activeHold()) return blocked('kiểm tra xác nhận', 'Chưa có giữ chỗ còn hiệu lực cho lựa chọn này.');
      state.approved = true; state.approvalKey = key();
      log('khách xác nhận', 'info', 'Xác nhận đúng bản tóm tắt hiện tại, chưa thực thi tool.', { flight: state.selected, people: [...state.people] });
      return true;
    }
    function exchange() {
      if (state.mode === 'ban') { blocked('doi_chuyen_bay', 'Mức Cấm: AI không được gọi tool đổi chuyến.'); handoff('Việc đổi chuyến bị cấm trong chế độ so sánh'); return false; }
      if (state.exchanged || state.refunded) return blocked('doi_chuyen_bay', 'Không gọi lại: đặt chỗ đã đổi hoặc đã gửi hoàn. Muốn sửa cần nhân viên kiểm tra.');
      if (state.intent !== 'exchange' || !activeHold()) return blocked('doi_chuyen_bay', 'Chưa có đủ chỗ giữ còn hiệu lực. Không đổi; cần kiểm tra và giữ lại.');
      if (state.mode !== 'auto' && (!state.approved || state.approvalKey !== key())) return blocked('doi_chuyen_bay', 'Chưa có xác nhận cuối hợp lệ cho đúng chuyến và hành khách. Chưa đổi vé.');
      if (state.people.length === 1 && state.people[0] === 'child') return blocked('doi_chuyen_bay', 'Không tự xử lý trẻ nhỏ bay một mình.');
      const held = activeHold(); held.used = true;
      state.inventory[state.selected] -= state.people.length;
      state.bookingFlight = state.selected; state.bookingPeople = [...state.people]; state.exchanged = true;
      log('doi_chuyen_bay', 'executed', state.mode === 'auto' ? 'ĐỐI CHỨNG: đổi không có xác nhận cuối.' : 'Khách xác nhận cuối; giữ chỗ còn hiệu lực.', { flight: state.selected, people: [...state.people] });
      say(`Đã đổi sang ${state.selected} cho ${state.people.length} hành khách (mô phỏng). Lần đổi miễn phí đã được dùng. Không có tool hoàn tác; nếu đổi sai, chuyển nhân viên kiểm tra.`, ['PAIR']);
      return true;
    }
    function provideRefundInfo(time, method) {
      if (!time?.trim() || !method?.trim()) return blocked('fixture kiểm thử', 'Điền cả thời gian và phương thức giả định. Không tự dùng chính sách tham khảo.');
      state.refundInfo = { time: time.trim(), method: method.trim(), simulated: true };
      state.approved = false; state.approvalKey = '';
      log('fixture kiểm thử', 'info', 'Người demo bổ sung thông tin nhân viên GIẢ ĐỊNH, không phải chính sách Bay Mẫu.', state.refundInfo);
      say('Đã bổ sung thông tin nhân viên GIẢ ĐỊNH cho kiểm thử. Đây không phải dữ liệu gốc của track. Khách vẫn phải xác nhận cuối trước khi gửi.', ['G2']);
      return true;
    }
    function refund() {
      if (state.exchanged || state.refunded) return blocked('gui_yeu_cau_hoan_ve', 'Không gửi lại hoặc tự hoàn sau đổi trong ca này; cần nhân viên kiểm tra trạng thái.');
      if (state.intent !== 'refund' || !state.refundInfo) { blocked('gui_yeu_cau_hoan_ve', 'Chưa đủ thời gian và phương thức hoàn áp dụng. Yêu cầu chưa gửi.'); handoff('Thiếu thông tin hoàn cho đặt chỗ'); return false; }
      if (!state.people.length || !state.approved || state.approvalKey !== key()) return blocked('gui_yeu_cau_hoan_ve', 'Chưa có xác nhận cuối hợp lệ về hành khách và hậu quả không thể rút lại.');
      state.refunded = true;
      log('gui_yeu_cau_hoan_ve', 'executed', 'Khách xác nhận sau khi đọc thông tin GIẢ ĐỊNH đã bổ sung.', { people: [...state.people], refundInfo: state.refundInfo });
      say('Đã gửi yêu cầu hoàn (mô phỏng). Yêu cầu đã gửi không thể huỷ. Các thời gian/phương thức vừa dùng là fixture kiểm thử do người demo nhập, không phải chính sách đã xác minh của hãng.', ['PAIR']);
      return true;
    }
    function expire() {
      state.holds.forEach(h => { if (!h.used) h.expiresAt = Date.now() - 1; });
      state.approved = false; state.approvalKey = '';
      log('đồng hồ kiểm thử', 'info', 'Làm hết hạn giữ chỗ ngay; không phải thời gian thực đã trôi 20 phút.');
      say('Giữ chỗ đã hết hạn (mô phỏng). Xác nhận cũ mất hiệu lực; cần tra, giữ và xác nhận lại.', ['G2']);
    }
    function dismiss() {
      state.intent = 'info'; state.approved = false; state.approvalKey = '';
      say('Đã bỏ bước đang chọn. Chưa thực hiện thêm đổi/hoàn. Chỗ đã giữ vẫn tự nhả khi hết hạn, không nhả tức thì.', ['G8']);
    }
    function chat(text) {
      text = String(text).trim().slice(0, 1500); if (!text) return;
      state.messages.push({ role: 'user', text }); state.lastNotice = '';
      const n = normalize(text);
      // ponytail: deterministic Vietnamese keyword routing; replace only if real-AI evaluation is required.
      if (/bo qua|toi la nhan vien|toi la nguoi cua hang/.test(n)) { say('Tin nhắn tự xưng nhân viên không cấp thêm quyền. Mình không bỏ bước xác nhận hoặc đổi thay khách.', ['G10']); return; }
      if (/doi nham|sai roi|gui nham|hoan nham/.test(n)) {
        say(state.exchanged ? 'Đặt chỗ đã đổi trong mô phỏng. Mình ghi nhận phản ánh; chưa thể cam kết đổi lại miễn phí hoặc còn chỗ trên chuyến trước.' : state.refunded ? 'Yêu cầu hoàn đã gửi trong mô phỏng và không thể rút lại. Mình ghi nhận phản ánh để hỗ trợ.' : 'Mình ghi nhận phản ánh. Nhật ký phiên này chưa có đổi/hoàn thành công; cần kiểm tra trạng thái trước khi kết luận nguyên nhân.', ['PAIR']);
        handoff('Khách báo thao tác sai'); return;
      }
      if (state.exchanged || state.refunded) {
        say(state.exchanged ? `Trạng thái hiện tại: đã đổi sang ${state.bookingFlight} trong mô phỏng; lần đổi miễn phí đã dùng. Mình không tự đổi hoặc gửi hoàn tiếp trong ca này. Nếu muốn sửa cần nhân viên kiểm tra.` : 'Yêu cầu hoàn đã gửi trong mô phỏng và không thể rút lại. Mình không gửi lại hoặc hứa khôi phục vé.', ['PAIR']);
        if (/doi|hoan|huy|nhan vien|ho tro/.test(n)) handoff('Yêu cầu tiếp sau thao tác đã hoàn tất');
        return;
      }
      if (/doi ten|bay mot minh/.test(n)) { say('Ca đổi tên hoặc trẻ nhỏ bay một mình nằm ngoài quyền xử lý của AI.', ['G10']); handoff('Ca ngoài thẩm quyền'); return; }
      if (/nhan vien|ho tro/.test(n)) { handoff(); return; }
      if (/hai me con|ca hai|2 nguoi|hai hanh khach/.test(n)) select(state.selected, ['adult', 'child']);
      if (/boi thuong/.test(n)) { lookup(); say('Theo fixture Bay Mẫu, huỷ do thời tiết được đổi miễn phí một lần trong 48 giờ hoặc hoàn toàn bộ, không bồi thường tiền mặt.', ['G2']); return; }
      if (/hoan|huy het/.test(n)) {
        state.intent = 'refund'; state.approved = false; state.approvalKey = ''; lookup();
        say('Mình chưa gửi yêu cầu hoàn TRV-7Q2K. Vui lòng chọn hành khách và đọc cảnh báo: gửi rồi không huỷ được. Fixture cho phép hoàn toàn bộ nhưng chưa có thời gian/phương thức áp dụng; không tự gán mốc 90 ngày hoặc voucher.', ['G10', 'G2']);
        if (!state.refundInfo) handoff('Kiểm tra thời gian và phương thức hoàn còn thiếu');
        return;
      }
      if (/doi|chuyen do|chuyen nay|bm\s*20[15]/.test(n)) {
        state.intent = 'exchange'; state.approved = false; state.approvalKey = ''; lookup();
        if (state.mode === 'ban') { say('Chế độ Cấm: mình có thể tra lựa chọn nhưng không được đổi vé. Bạn có thể duyệt giữ chỗ trong lúc chờ hỗ trợ.', ['G10']); handoff('Đổi vé cần nhân viên trong chế độ so sánh'); }
        else if (state.mode === 'auto') {
          state.selected = state.recommendation;
          say(`ĐỐI CHỨNG RỦI RO: mình tự chọn ${state.selected || 'chưa có chuyến đủ chỗ'} cho nhóm hành khách đang chọn. Bạn chỉ duyệt giữ chỗ; sau đó chế độ Tự làm sẽ đổi luôn mà không hỏi xác nhận cuối. Điều này có thể sai ý bạn.`, ['G2']);
        } else say('“Chuyến đó” chưa đủ rõ sau nhiều lựa chọn. Bạn muốn BM 201 lúc 07:00 hay BM 205 lúc 09:30 ngày 13/11, cho hành khách nào? Mình chưa giữ và chưa đổi; hãy chọn bên dưới.', ['G10']);
        return;
      }
      if (/chuyen|con cho|may gio/.test(n)) {
        state.intent = 'info'; state.approved = false; lookup();
        say(`BM 213 đã huỷ do thời tiết. ${state.people.length === 2 ? 'BM 217 lúc 21:00 ngày 12/11 chỉ có 1 chỗ trong fixture, không đủ cho hai mẹ con.' : 'Kết quả tra theo danh sách hành khách đang chọn trên giao diện.'} ${state.recommendation ? `Phương án sớm nhất hiện đủ cho nhóm đã chọn: ${state.recommendation}.` : 'Hiện chưa có chuyến đủ chỗ.'} Số chỗ có thể thay đổi trước khi giữ được xác nhận. Mình mới tra, chưa giữ hoặc đổi vé.`, ['G2']); return;
      }
      say('Đây là chatbot mô phỏng bằng kịch bản, không phải AI thật. Mình chưa xác định được ý định nên chưa thực hiện hành động. Hãy dùng tin mẫu hoặc nói rõ muốn tra chuyến, đổi vé, hoàn tiền hay gặp nhân viên.', ['G10']);
    }
    say('Chào bạn, mình là trợ lý AI mô phỏng. BM 213 đã huỷ do thời tiết. Mình có thể tra chuyến, hỗ trợ đổi/hoàn theo mức cho phép; mọi thao tác ở đây chỉ tác động dữ liệu dựng.', ['G2']);
    return { state, chat, select, hold, approve, exchange, refund, provideRefundInfo, expire, dismiss, handoff, activeHold, available };
  }
  const api = { createDemo, flights, passengers, modes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TravelDemo = api;
})(globalThis);
