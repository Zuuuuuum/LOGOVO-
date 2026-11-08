/* Школа LOGOVO — форма заявки на обучение */
(function () {
  'use strict';
  var form = document.getElementById('formSchool');
  if (!form) return;

  function setError(name, msg) {
    var el = form.querySelector('[data-error="' + name + '"]');
    if (el) el.textContent = msg || '';
  }

  function validate() {
    var ok = true;
    var name = form.querySelector('[name="name"]');
    var phone = form.querySelector('[name="phone"]');
    var consent = form.querySelector('[name="consent"]');
    setError('name', ''); setError('phone', ''); setError('consent', '');
    if (!name || name.value.trim().length < 2) { setError('name', 'Укажите имя'); ok = false; }
    if (!phone || phone.value.replace(/\D/g, '').length < 10) { setError('phone', 'Укажите корректный телефон'); ok = false; }
    if (consent && !consent.checked) { setError('consent', 'Нужно согласие на обработку данных'); ok = false; }
    return ok;
  }

  var phone = form.querySelector('[name="phone"]');
  if (phone) {
    phone.addEventListener('input', function () {
      var v = phone.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (!v.startsWith('7')) v = '7' + v;
      v = v.slice(0, 11);
      var out = '+7';
      if (v.length > 1) out += ' (' + v.slice(1, 4);
      if (v.length >= 4) out += ') ' + v.slice(4, 7);
      if (v.length >= 7) out += '-' + v.slice(7, 9);
      if (v.length >= 9) out += '-' + v.slice(9, 11);
      phone.value = out;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    form.classList.add('is-done');
    var success = form.querySelector('[data-success]');
    if (success) success.classList.add('is-visible');
  });
})();

/* Лайтбокс для фото учеников */
(function () {
  'use strict';
  var grid = document.getElementById('studentsGrid');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  if (!grid || !lb || !lbImg) return;
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  grid.addEventListener('click', function (e) {
    var item = e.target.closest('.gallery-item');
    if (!item) return;
    lbImg.src = item.getAttribute('data-src');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-close-lightbox]'), function (b) {
    b.addEventListener('click', close);
  });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();
