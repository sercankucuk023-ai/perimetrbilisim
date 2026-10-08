// Perimetr Bilişim — shared scripts
(function () {
  // mobile menu
  var burger = document.querySelector('.burger');
  var panel = document.getElementById('mobile-panel');
  if (burger && panel) {
    burger.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { panel.hidden = true; burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  // year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // preselect service in contact form from ?service=
  var sel = document.getElementById('f-service');
  if (sel) {
    var q = new URLSearchParams(location.search).get('service');
    if (q) { Array.prototype.forEach.call(sel.options, function (o) { if (o.value === q) sel.value = q; }); }
  }

  // contact form (demo — connect to a form service before going live)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('f-name');
      var email = document.getElementById('f-email');
      var consent = document.getElementById('f-consent');
      var note = document.getElementById('f-note');
      [name, email].forEach(function (i) { i.classList.remove('invalid'); });
      var ok = true;
      if (!name.value.trim()) { name.classList.add('invalid'); ok = false; }
      if (!email.value || !email.validity.valid) { email.classList.add('invalid'); ok = false; }
      if (!ok) { note.textContent = 'Please add your name and a valid work email.'; return; }
      if (!consent.checked) { note.textContent = 'Please confirm you have read the privacy notice.'; return; }
      var btn = form.querySelector('button[type=submit]');
      var sent = document.getElementById('f-sent');
      var err = document.getElementById('f-err');
      err.hidden = true;
      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Sending…';
      var data = Object.fromEntries(new FormData(form));
      var sel = document.getElementById('f-service');
      data.service = sel.options[sel.selectedIndex].text;
      data.replyto = data.email;
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res.success) {
          sent.hidden = false;
          note.hidden = true;
          form.reset();
          btn.textContent = 'Sent';
        } else { throw new Error(res.message || 'failed'); }
      }).catch(function () {
        err.hidden = false;
        btn.disabled = false;
        btn.textContent = label;
      });
    });
  }
})();
