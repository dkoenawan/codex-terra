/* ═══════════════════════════════════════════════════════════════════════
   CODEX TERRA — shared behaviour
   Reveal-on-scroll, nav background on scroll, smooth anchor scroll.
   Include on every page:  <script src="assets/codex.js" defer></script>
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  function init() {
    // reveal on scroll
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    // nav background on scroll
    var nav = document.querySelector(".codex-nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 80); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* Shared SVG defs — inject the corner ornament symbol once per page. */
(function () {
  var svg = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="corner-orn" viewBox="0 0 36 36"><g fill="none" stroke="#8e7338" stroke-width="0.9">' +
    '<path d="M2,18 Q2,2 18,2"/><path d="M2,12 Q4,4 12,2" opacity="0.6"/>' +
    '<circle cx="6" cy="6" r="1.4" fill="#8e7338"/><path d="M2,18 L8,18 M18,2 L18,8"/>' +
    '</g></symbol></defs></svg>';
  var mount = function () { document.body.insertAdjacentHTML("afterbegin", svg); };
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
