'use strict';
const { createDemo, flights, passengers, modes } = TravelDemo;
let demo = createDemo();
const $ = selector => document.querySelector(selector);
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const names = () => passengers.filter(p => demo.state.people.includes(p.id)).map(p => p.name).join(' và ') || 'chưa chọn hành khách';
const number = { G10: '①', G2: '②', G8: '③', PAIR: '④' };
const tag = (level, style) => `<span class="pill ${style}">${level}</span>`;
const principles = [
  ['G10', 'Thu hẹp khi nghi ngờ', 'Câu hỏi lại “BM 201 hay BM 205?” và nút thực thi bị khoá khi thiếu xác nhận. Chế độ Tự làm cố ý bỏ chốt xác nhận đổi để so sánh.'],
  ['G2', 'Nói rõ giới hạn của AI', 'Nhãn số chỗ có thể thay đổi; trạng thái chưa giữ/chưa đổi; thiếu dữ liệu hoàn thì thừa nhận, không đoán chính sách.'],
  ['G8', 'Bỏ qua dễ dàng', 'Nút Quay lại cho phép bỏ đề xuất trước thao tác. Giữ chỗ cũ tự hết hạn; không giả vờ có hoàn tác vé đã đổi.'],
  ['PAIR', 'Errors + Graceful Failure', 'Đường gặp nhân viên có lý do và nội dung bàn giao. Khi đổi/hoàn sai, hiển thị trạng thái thật và giới hạn khả năng sửa.']
];
function render() {
  const s = demo.state, config = modes[s.mode];
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === s.mode)));
  $('#mode-description').className = `mode-description${s.mode === 'auto' ? ' risky' : ''}`;
  $('#mode-description').innerHTML = `<strong>“${escapeHTML(config.promise)}”</strong><small>${escapeHTML(config.note)} Đổi chế độ sẽ bắt đầu một ca mới.</small>`;
  $('#booking-status').textContent = s.refunded ? 'Đã gửi yêu cầu hoàn · MÔ PHỎNG · Không thể rút lại' : s.exchanged ? `Đã đổi sang ${s.bookingFlight} · Lần đổi miễn phí đã dùng · MÔ PHỎNG` : 'Chưa đổi vé · Chưa gửi hoàn · Còn lần đổi miễn phí';
  $('#chat').innerHTML = s.messages.map(message => `<div class="message ${message.role}">${message.role === 'ai' ? '<span class="speaker">TRỢ LÝ AI · MÔ PHỎNG</span>' : ''}${escapeHTML(message.text)}${message.hax?.length ? `<div class="message-hax">${message.hax.map(hax => `<a class="hax-token" href="#principle-${hax}">${number[hax]} ${hax === 'PAIR' ? 'PAIR' : hax}</a>`).join('')}</div>` : ''}</div>`).join('');
  $('#chat').scrollTop = $('#chat').scrollHeight;
  renderActions();
  const tools = [
    ['tra_cuu_dat_cho', 'Tự làm', 'success', 'Chỉ đọc; dữ liệu tra không phải cam kết giữ chỗ.'],
    ['giu_cho_chuyen_moi', 'Cần duyệt', 'warn', 'Khách chọn chuyến và người bay, duyệt giữ 20 phút.'],
    ['doi_chuyen_bay', config.level, s.mode === 'auto' ? 'danger' : s.mode === 'ban' ? 'danger' : 'warn', s.mode === 'auto' ? 'Đối chứng: bỏ xác nhận cuối, có thể đổi sai ý khách.' : s.mode === 'ban' ? 'AI không thực hiện; nhân viên xử lý thay.' : 'Dùng lần đổi miễn phí duy nhất; cần xác nhận cuối.'],
    ['gui_yeu_cau_hoan_ve', 'Cần duyệt', 'warn', 'Đủ thông tin áp dụng và khách xác nhận; gửi rồi không huỷ.'],
    ['chuyen_nhan_vien', 'Tự làm', 'success', 'Ca bắt buộc chuyển ngay; chưa có cam kết thời gian phản hồi.']
  ];
  $('#tools').innerHTML = tools.map(([tool, level, color, reason]) => `<tr class="${tool === 'doi_chuyen_bay' && s.mode !== 'spec' ? 'changed' : ''}"><td><code>${tool}</code><small>${reason}</small></td><td>${tag(level, color)}</td></tr>`).join('');
  $('#principles').innerHTML = principles.map(([id, title, detail]) => `<div class="principle" id="principle-${id}"><span class="number">${number[id]}</span><div><strong>${id} · ${title}</strong><p>${detail}</p></div></div>`).join('');
  $('#tool-log').innerHTML = s.logs.length ? [...s.logs].reverse().map(row => `<div class="log-entry"><div><code>${row.id.toString().padStart(2, '0')} · ${escapeHTML(row.tool)}</code>${tag(row.result === 'executed' ? 'Đã chạy · mô phỏng' : row.result === 'blocked' ? 'Bị chặn' : 'Sự kiện', row.result === 'executed' ? 'success' : row.result === 'blocked' ? 'danger' : 'neutral')}</div><p>${escapeHTML(row.reason)}</p>${row.data.flight ? `<p>${escapeHTML(row.data.flight)} · ${escapeHTML((row.data.people || []).map(id => passengers.find(p => p.id === id)?.name || id).join(', '))}</p>` : ''}</div>`).join('') : '<p class="log-empty">Chưa gọi tool nào. Gửi một tin mẫu để quan sát quyết định.</p>';
}
function renderActions() {
  const s = demo.state, held = demo.activeHold();
  if (s.exchanged || s.refunded) {
    $('#action-panel').innerHTML = `<div class="notice ${s.mode === 'auto' ? 'danger' : 'success'}"><strong>${s.refunded ? 'Yêu cầu hoàn đã gửi' : `Đã đổi sang ${s.bookingFlight}`} · MÔ PHỎNG</strong><br>${s.exchanged ? `Hành khách: ${escapeHTML(passengers.filter(p => s.bookingPeople.includes(p.id)).map(p => p.name).join(', '))}. Lần đổi miễn phí đã sử dụng.` : 'Yêu cầu đã gửi không thể rút lại.'} Không có nút hoàn tác cho hành động này.</div><div class="action-buttons"><button class="button outline" data-chat="Bạn vừa đổi nhầm hoặc gửi nhầm rồi.">Báo thao tác sai</button><button class="button outline" data-action="handoff">Gặp nhân viên</button><button class="button quiet" data-action="reset">Làm lại ca</button></div>`;
    return;
  }
  if (s.intent === 'info') {
    $('#action-panel').innerHTML = `${s.recommendation ? `<div class="evidence">Căn cứ: fixture TRV-7Q2K · 2 hành khách · BM 217 có 1 chỗ, BM 201 có 9 chỗ, BM 205 có 4 chỗ ở trạng thái ban đầu. Đây là dữ liệu dựng; chưa có giữ chỗ.</div>` : ''}<div class="action-buttons"><button class="button outline" data-chat="Mình muốn đổi chuyến, cho xem các lựa chọn.">Xem phương án đổi</button><button class="button quiet" data-action="handoff">Gặp nhân viên</button></div>`;
    return;
  }
  let html = `<h3>${s.intent === 'refund' ? 'Xác nhận phạm vi hoàn vé' : 'Chọn chuyến và hành khách'}</h3>`;
  if (s.intent === 'exchange') {
    html += `<div class="flights">${flights.map(f => `<button class="flight-option ${demo.available(f.id) < s.people.length ? 'insufficient' : ''}" data-flight="${f.id}" aria-pressed="${s.selected === f.id}"><span><strong>${f.id} · ${f.time}</strong><small>${f.date} · Hà Nội → TP.HCM</small></span><span class="seats">${Math.max(0, demo.available(f.id))} chỗ chưa giữ${demo.available(f.id) < s.people.length ? '<br>Không đủ nhóm đã chọn' : ''}</span></button>`).join('')}</div>`;
  }
  html += `<div class="travellers">${passengers.map(p => `<label class="traveller"><input type="checkbox" id="person-${p.id}" data-person="${p.id}" ${s.people.includes(p.id) ? 'checked' : ''}>${p.name} · ${p.detail}</label>`).join('')}</div>`;
  if (s.lastNotice) html += `<div class="notice">${escapeHTML(s.lastNotice)}</div>`;
  if (s.intent === 'exchange') {
    html += `<div class="evidence">Số chỗ có thể đổi trước khi giữ được xác nhận. Giữ chỗ chưa đổi vé và chưa dùng lần đổi miễn phí.</div>`;
    if (s.mode === 'auto') html += '<div class="notice danger"><strong>Đối chứng Tự làm:</strong> sau khi bạn duyệt giữ chỗ, AI sẽ tự đổi, không cần xác nhận đổi cuối. Mức này có thể quá tay ở ca #3.</div>';
    html += `<div class="action-buttons"><button class="button primary" data-action="hold" ${!s.selected || !s.people.length || held ? 'disabled' : ''}>${held ? 'Đã giữ chỗ' : 'Giữ chỗ 20 phút'}</button><button class="button quiet" data-action="dismiss">Quay lại, chưa đổi</button></div>`;
    if (held) html += `<div class="notice success"><strong>Đã giữ ${escapeHTML(held.flight)} cho ${held.people.length} người · MÔ PHỎNG</strong><br>Còn <span class="timer" data-deadline="${held.expiresAt}">${timeRemaining(held.expiresAt)}</span> · Chưa đổi vé. Hết hạn phải kiểm tra và xác nhận lại.</div>`;
    else if (s.holds.some(h => h.expiresAt <= Date.now())) html += '<div class="notice">Giữ chỗ cũ đã hết hạn. Xác nhận cũ mất hiệu lực.</div>';
    if (s.mode === 'ban') html += '<div class="notice danger">Mức Cấm: không có nút đổi vé. Bạn có thể gặp nhân viên; thời gian phản hồi chưa được chốt.</div>';
    else if (s.mode !== 'auto') {
      const f = flights.find(f => f.id === s.selected);
      html += `<label class="approval"><input id="approval" type="checkbox" ${s.approved ? 'checked' : ''} ${!held ? 'disabled' : ''}><span>Tôi xác nhận đổi BM 213 → <strong>${escapeHTML(f ? `${f.id} · ${f.date} · ${f.time}` : 'chưa chọn chuyến')}</strong> cho <strong>${escapeHTML(names())}</strong>, dùng lần đổi miễn phí duy nhất. Đổi lại có thể không còn miễn phí hoặc không còn chỗ.</span></label><div class="action-buttons"><button class="button primary" data-action="exchange" ${!held || !s.approved ? 'disabled' : ''}>Xác nhận đổi vé</button></div>`;
    }
  } else {
    html += '<div class="notice danger"><strong>Gửi rồi không thể huỷ yêu cầu.</strong><br>Fixture Bay Mẫu cho phép hoàn toàn bộ khi huỷ do thời tiết; không có bồi thường tiền mặt.</div>';
    html += s.refundInfo ? `<div class="evidence"><strong>FIXTURE GIẢ ĐỊNH DO NGƯỜI DEMO NHẬP</strong><br>Thời gian: ${escapeHTML(s.refundInfo.time)}<br>Phương thức: ${escapeHTML(s.refundInfo.method)}<br>Không phải chính sách gốc của track hoặc kết quả nhân viên thật kiểm tra.</div>` : '<div class="notice"><strong>Chưa gửi — cần kiểm tra thông tin hoàn.</strong><br>Chưa có thời gian/phương thức áp dụng. Đã chuyển hỗ trợ mô phỏng; không tự lấy 90 ngày hay voucher từ ví dụ tham khảo. Người demo có thể bổ sung fixture giả định ở Công cụ kiểm thử.</div>';
    html += `<label class="approval"><input id="approval" type="checkbox" ${s.approved ? 'checked' : ''} ${!s.refundInfo || !s.people.length ? 'disabled' : ''}><span>Tôi chọn hoàn cho <strong>${escapeHTML(names())}</strong>, đã đọc thời gian/phương thức áp dụng và hiểu rằng yêu cầu đã gửi không thể rút lại.</span></label><div class="action-buttons"><button class="button danger" data-action="refund" ${!s.refundInfo || !s.approved || !s.people.length ? 'disabled' : ''}>Gửi yêu cầu hoàn · mô phỏng</button><button class="button quiet" data-action="dismiss">Quay lại, chưa gửi</button></div>`;
  }
  html += '<div class="action-buttons"><button class="button outline" data-action="handoff">Gặp nhân viên</button></div>';
  $('#action-panel').innerHTML = html;
}
function timeRemaining(deadline) { const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
function reset(mode = demo.state.mode) { demo = createDemo(mode); $('#refund-time').value = ''; $('#refund-method').value = ''; render(); }
document.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button || button.disabled) return;
  if (button.dataset.mode) { reset(button.dataset.mode); return; }
  if (button.dataset.chat) { demo.chat(button.dataset.chat); render(); return; }
  if (button.dataset.flight) { demo.select(button.dataset.flight, demo.state.people); render(); return; }
  const action = button.dataset.action;
  if (action === 'reset') { reset(); return; }
  if (['hold', 'exchange', 'refund', 'dismiss', 'handoff'].includes(action)) { demo[action](); render(); }
});
document.addEventListener('change', event => {
  if (event.target.dataset.person) {
    const selected = passengers.filter(p => $(`#person-${p.id}`).checked).map(p => p.id);
    demo.select(demo.state.selected, selected); render(); $(`#person-${event.target.dataset.person}`)?.focus();
  }
  if (event.target.id === 'approval') { demo.approve(event.target.checked); render(); $('#approval')?.focus(); }
});
$('#chat-form').addEventListener('submit', event => { event.preventDefault(); const input = $('#chat-input'); demo.chat(input.value); input.value = ''; render(); input.focus(); });
$('#fixture-form').addEventListener('submit', event => { event.preventDefault(); demo.provideRefundInfo($('#refund-time').value, $('#refund-method').value); render(); });
$('#reset').addEventListener('click', () => reset());
$('#annotations').addEventListener('change', event => document.body.classList.toggle('hide-annotations', !event.target.checked));
$('#expire').addEventListener('click', () => { demo.expire(); render(); });
$('#sold-out').addEventListener('click', () => {
  demo.state.inventory['BM 201'] = 0;
  demo.state.holds.filter(h => h.flight === 'BM 201' && !h.used).forEach(h => { h.expiresAt = Date.now() - 1; });
  demo.approve(false);
  demo.state.lastNotice = 'KIỂM THỬ: BM 201 không còn chỗ, giữ chỗ liên quan mất hiệu lực; cần tra và chọn lại.';
  demo.state.logs.push({ id: demo.state.logs.length + 1, at: new Date().toISOString(), tool: 'fixture kiểm thử', result: 'info', reason: demo.state.lastNotice, data: {} });
  render();
});
$('#export').addEventListener('click', () => {
  const report = { title: 'LAB5 — bằng chứng mô phỏng, không phải giao dịch thật', mode: demo.state.mode, exportedAt: new Date().toISOString(), state: demo.state };
  const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = `lab5-${demo.state.mode}-evidence.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
setInterval(() => {
  const timer = $('[data-deadline]');
  if (timer) {
    timer.textContent = timeRemaining(Number(timer.dataset.deadline));
    if (Number(timer.dataset.deadline) <= Date.now()) { demo.approve(false); render(); }
  }
}, 1000);
render();
