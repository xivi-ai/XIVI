/* Frame guard: GitHub Pages cannot send X-Frame-Options, so refuse to run inside another site's frame. */
(function () {
  if (window.top === window.self) return;
  try { window.top.location = window.self.location; }
  catch (e) { document.documentElement.style.display = 'none'; }
})();
