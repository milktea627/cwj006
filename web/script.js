/* ==========================================================================
   喵呜百科 · 交互脚本（原生 JavaScript，无依赖）
   ========================================================================== */
(function () {
  'use strict';

  /* 1. 移动端菜单 */
  function menu() {
    var btn = document.querySelector('.burger');
    var list = document.getElementById('menu');
    if (!btn || !list) return;
    btn.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? '✕' : '☰';
    });
    list.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        list.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = '☰';
      }
    });
  }

  /* 2. 页脚年份 */
  function year() {
    var y = String(new Date().getFullYear());
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (n) {
      n.textContent = y;
    });
  }

  /* 3. 滚动淡入 */
  function reveal() {
    var items = document.querySelectorAll('.rv');
    if (!items.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* 4. 数字滚动 */
  function counters() {
    var nodes = document.querySelectorAll('[data-num]');
    if (!nodes.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function go(el) {
      var target = parseInt(el.getAttribute('data-num'), 10) || 0;
      if (reduce) { el.textContent = target; return; }
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 900, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nodes, go);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { go(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(nodes, function (el) { io.observe(el); });
  }

  /* 5. 相册灯箱 */
  function lightbox() {
    var figs = document.querySelectorAll('.gal figure');
    if (!figs.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', '图片预览');
    box.innerHTML = '<button class="lb-close" type="button" aria-label="关闭">✕</button>' +
                    '<div><img alt=""><p></p></div>';
    document.body.appendChild(box);

    var img = box.querySelector('img');
    var cap = box.querySelector('p');
    var close = box.querySelector('.lb-close');

    Array.prototype.forEach.call(figs, function (fig) {
      fig.addEventListener('click', function () {
        var im = fig.querySelector('img');
        var c = fig.querySelector('figcaption');
        img.src = im.getAttribute('src');
        img.alt = im.getAttribute('alt') || '';
        cap.textContent = c ? c.textContent.trim() : '';
        box.classList.add('on');
        document.body.style.overflow = 'hidden';
        close.focus();
      });
    });

    function shut() {
      box.classList.remove('on');
      document.body.style.overflow = '';
    }
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === close) shut();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('on')) shut();
    });
  }

  /* 6. 喵一声（留言板） */
  function board() {
    var form = document.getElementById('noteForm');
    if (!form) return;

    var KEY = 'miao.board.v1';
    var list = document.getElementById('noteList');
    var hint = document.getElementById('hint');
    var nameEl = document.getElementById('who');
    var textEl = document.getElementById('what');

    function load() {
      try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
    }
    function save(v) {
      try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* 忽略隐私模式限制 */ }
    }
    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    }
    function time(ts) {
      var d = new Date(ts);
      var p = function (n) { return n < 10 ? '0' + n : '' + n; };
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
             ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }

    function draw() {
      var data = load();
      if (!data.length) {
        list.innerHTML = '<li class="empty">还没有人喵过。要不要当第一只？</li>';
        return;
      }
      list.innerHTML = data.map(function (m) {
        return '<li class="note">' +
                 '<header class="note-hd"><strong>' + esc(m.name) + '</strong>' +
                 '<time datetime="' + new Date(m.time).toISOString() + '">' + time(m.time) + '</time></header>' +
                 '<p>' + esc(m.text) + '</p>' +
                 '<button class="rm" type="button" data-id="' + m.id + '" aria-label="删除">✕</button>' +
               '</li>';
      }).join('');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameEl.value.trim();
      var text = textEl.value.trim();
      hint.classList.remove('bad');

      if (!name) {
        hint.textContent = '先留个称呼吧，比如“三号楼的花猫”。';
        hint.classList.add('bad');
        nameEl.focus();
        return;
      }
      if (text.length < 2) {
        hint.textContent = '至少写两个字，喵一声也算。';
        hint.classList.add('bad');
        textEl.focus();
        return;
      }

      var data = load();
      data.unshift({
        id: String(Date.now()) + Math.random().toString(16).slice(2, 6),
        name: name.slice(0, 20),
        text: text.slice(0, 300),
        time: Date.now()
      });
      save(data.slice(0, 100));
      form.reset();
      hint.textContent = '已贴上，谢谢你的到访。';
      draw();
    });

    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.rm');
      if (!btn) return;
      save(load().filter(function (m) { return m.id !== btn.getAttribute('data-id'); }));
      hint.textContent = '已删除。';
      draw();
    });

    draw();
  }

  function boot() {
    menu(); year(); reveal(); counters(); lightbox(); board();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
