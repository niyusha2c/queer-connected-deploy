/* "Create your event account" pop-up for the static pages (About, FAQs).
   Home and Events have the same pop-up built into their page bundles.
   Preview only: submissions are not sent anywhere yet. */
(function () {
  var css = '\
.acct-wrap{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}\
.acct-wrap.open{display:flex}\
.acct-bg{position:absolute;inset:0;background:rgba(20,17,15,.55)}\
.acct-modal{position:relative;width:100%;max-width:540px;max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;background:#FFF9F4;border-radius:16px;padding:32px 32px 28px;box-shadow:0 24px 60px rgba(20,17,15,.28)}\
.acct-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:24px}\
.acct-title{margin:0;font:800 30px/1 "Bricolage Grotesque",sans-serif;letter-spacing:-.03em;color:#14110F;white-space:nowrap}\
.acct-x{flex:none;width:34px;height:34px;margin:-4px -6px 0 0;display:flex;align-items:center;justify-content:center;background:none;border:0;border-radius:8px;color:#3B332D;cursor:pointer}\
.acct-x:hover{background:#FDF1E7}\
.acct-fields{display:flex;flex-direction:column;gap:18px}\
.acct-field{display:flex;flex-direction:column;gap:7px}\
.acct-label{font:600 14px/1 Karla,sans-serif;color:#14110F}.acct-label b{color:#D95F2B;font-weight:600}\
.acct-in{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid rgba(20,17,15,.14);border-radius:10px;background:#FDF1E7;color:#14110F;font:400 15px/1.2 Karla,sans-serif}\
textarea.acct-in{resize:vertical;min-height:104px;line-height:1.4}\
.acct-in.bad{border-color:rgba(185,76,31,.8)}\
.acct-in::placeholder{color:#A88A76;opacity:1}\
.acct-in:focus{outline:none;border-color:rgba(217,95,43,.7) !important;box-shadow:0 0 0 3px rgba(217,95,43,.15)}\
.acct-err{font:500 12px/1.3 Karla,sans-serif;color:#B94C1F}.acct-err:empty{display:none}\
.acct-btn{width:100%;padding:15px 16px;border:0;border-radius:10px;background:#D95F2B;color:#FFF9F4;font:700 16px Karla,sans-serif;cursor:pointer}\
.acct-btn:hover{background:#B94C1F}\
.acct-x:focus-visible,.acct-btn:focus-visible{outline:2px solid #D95F2B;outline-offset:2px}\
.acct-note{margin:-6px 0 0;text-align:center;font:400 12px/1.3 Karla,sans-serif;color:#94664A}\
.acct-thanks{margin:0 0 24px;font:400 16px/1.5 Karla,sans-serif;color:#3B332D}.acct-thanks strong{color:#14110F}\
[data-acct-open]{cursor:pointer}.hdr-cta[data-acct-open]:hover{background:#B94C1F}\
@media (max-width:640px){.acct-modal{padding:24px 20px 22px}.acct-title{font-size:19px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function field(key, label, ph, req, type) {
    var ctl = type === 'textarea'
      ? '<textarea id="acct-' + key + '" class="acct-in" rows="4" placeholder="' + ph + '"></textarea>'
      : '<input id="acct-' + key + '" class="acct-in" type="' + type + '" placeholder="' + ph + '">';
    return '<label class="acct-field" for="acct-' + key + '"><span class="acct-label">' + label + (req ? ' <b>*</b>' : '') + '</span>' + ctl + '<span class="acct-err" id="acct-' + key + '-err"></span></label>';
  }
  var wrap = document.createElement('div');
  wrap.className = 'acct-wrap';
  wrap.innerHTML =
    '<div class="acct-bg" data-acct-close></div>' +
    '<div class="acct-modal" role="dialog" aria-modal="true" aria-labelledby="acct-title">' +
      '<div class="acct-head"><h2 id="acct-title" class="acct-title">Create your event account</h2>' +
      '<button type="button" class="acct-x" aria-label="Close" data-acct-close><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg></button></div>' +
      '<div class="acct-form"><div class="acct-fields">' +
        field('name', 'Business name', 'Enter business name', true, 'text') +
        field('email', 'Email', 'Enter email', true, 'email') +
        field('url', 'Website URL', 'https://www.example.com/', false, 'url') +
        field('desc', 'Description', 'What kind of events do you run?', true, 'textarea') +
        '<button type="button" class="acct-btn" data-acct-submit style="margin-top:4px">Submit</button>' +
        '<p class="acct-note">Preview only. This form doesn\'t send yet.</p>' +
      '</div></div>' +
      '<div class="acct-sent" hidden><p class="acct-thanks">Thanks. We\'ll review your details and email you at <strong data-acct-email></strong> once you\'re approved. You\'ll then get your own dashboard to list your events.</p>' +
      '<button type="button" class="acct-btn" data-acct-close>Done</button></div>' +
    '</div>';
  document.body.appendChild(wrap);

  var $ = function (k) { return document.getElementById('acct-' + k); };
  var keys = ['name', 'email', 'url', 'desc'], tried = false, lastFocus = null;
  var form = wrap.querySelector('.acct-form'), sent = wrap.querySelector('.acct-sent');

  function errors() {
    var v = {}; keys.forEach(function (k) { v[k] = $(k).value.trim(); });
    var e = {};
    if (!v.name) e.name = 'Enter your business name';
    if (!v.email) e.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address';
    if (v.url && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(v.url)) e.url = 'Enter a valid web address';
    if (!v.desc) e.desc = 'Add a short description';
    return e;
  }
  function paint() {
    var e = tried ? errors() : {};
    keys.forEach(function (k) { $(k).classList.toggle('bad', !!e[k]); $(k + '-err').textContent = e[k] || ''; });
  }
  function open() {
    lastFocus = document.activeElement;
    wrap.classList.add('open');
    setTimeout(function () { (sent.hidden ? $('name') : wrap.querySelector('.acct-sent .acct-btn')).focus(); }, 0);
  }
  function close() {
    wrap.classList.remove('open');
    if (!sent.hidden) { keys.forEach(function (k) { $(k).value = ''; }); tried = false; paint(); sent.hidden = true; form.hidden = false; }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function submit() {
    tried = true; paint();
    if (Object.keys(errors()).length) return;
    // TODO: not sent anywhere yet. Needs Pippa's backend endpoint.
    wrap.querySelector('[data-acct-email]').textContent = $('email').value.trim();
    form.hidden = true; sent.hidden = false; tried = false;
    wrap.querySelector('.acct-sent .acct-btn').focus();
  }
  keys.forEach(function (k) { $(k).addEventListener('input', paint); });
  wrap.addEventListener('click', function (ev) {
    if (ev.target.closest('[data-acct-close]')) close();
    else if (ev.target.closest('[data-acct-submit]')) submit();
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && wrap.classList.contains('open')) close(); });
  document.querySelectorAll('[data-acct-open]').forEach(function (el) {
    el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0');
    el.addEventListener('click', open);
    el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); } });
  });
})();
