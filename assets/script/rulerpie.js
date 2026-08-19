(function () {
  var NATIVE_WIDTH = 400;
  var LEFT_INSET = 12;
  var USABLE_RATIO = 0.92;
  var TICKS = 16;

  var ruler = document.getElementById("ruler");
  var wrap = document.getElementById("ruler-wrap");
  var highlight = document.getElementById("highlight");
  var fraction = document.getElementById("fraction");
  var pie = document.getElementById("pie");
  var shaded = 1;

  function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  }

  function reduce(numerator, denominator) {
    var g = gcd(numerator, denominator);
    return numerator / g + "/" + denominator / g;
  }

  function fractionText(n) {
    if (n === 0) {
      return "0/16 is shaded.";
    }
    if (n === TICKS) {
      return "One whole (or 16/16) is shaded.";
    }
    if (n % 2 === 0) {
      return reduce(n, TICKS) + " (or " + n + "/16) is shaded.";
    }
    return n + "/16 is shaded.";
  }

  function metrics() {
    var width = ruler.clientWidth;
    var ratio = width / NATIVE_WIDTH;
    var leftMark = LEFT_INSET * ratio;
    var usable = width * USABLE_RATIO;
    return {
      ratio: ratio,
      leftMark: leftMark,
      usable: usable,
      markWidth: usable / TICKS
    };
  }

  function layoutHighlight() {
    var m = metrics();
    highlight.style.width = 10 * m.ratio + "px";
    highlight.style.height = Math.min(75 * m.ratio, ruler.clientHeight) + "px";
    highlight.style.left = m.leftMark + m.markWidth * shaded + "px";
  }

  function paintPie() {
    pie.style.setProperty("--slice", (shaded / TICKS) * 100 + "%");
    pie.classList.toggle("is-empty", shaded === 0);
    pie.classList.toggle("is-full", shaded === TICKS);
  }

  function setShaded(n) {
    shaded = Math.max(0, Math.min(TICKS, n | 0));
    var text = fractionText(shaded);
    fraction.textContent = text;
    ruler.setAttribute("aria-valuenow", String(shaded));
    ruler.setAttribute("aria-valuetext", text);
    layoutHighlight();
    paintPie();
  }

  function shadedFromClientX(clientX) {
    var rect = ruler.getBoundingClientRect();
    var m = metrics();
    var x = clientX - rect.left;
    var raw = Math.round(((x - m.leftMark - m.markWidth / 2) / m.usable) * TICKS);
    return Math.max(0, Math.min(TICKS, raw));
  }

  function shadedFromPieEvent(e) {
    var rect = pie.getBoundingClientRect();
    var dx = e.clientX - (rect.left + rect.width / 2);
    var dy = e.clientY - (rect.top + rect.height / 2);
    var angle = Math.atan2(-dy, -dx);
    if (angle < 0) {
      angle += Math.PI * 2;
    }
    return Math.max(0, Math.min(TICKS, Math.round((angle / (Math.PI * 2)) * TICKS)));
  }

  function bindPointer(el, fromEvent) {
    el.addEventListener("pointerdown", function (e) {
      if (!e.isPrimary) {
        return;
      }
      el.setPointerCapture(e.pointerId);
      setShaded(fromEvent(e));
    });
    el.addEventListener("pointermove", function (e) {
      if (!e.isPrimary) {
        return;
      }
      if (e.pointerType === "touch" && !el.hasPointerCapture(e.pointerId)) {
        return;
      }
      setShaded(fromEvent(e));
    });
  }

  bindPointer(ruler, function (e) {
    return shadedFromClientX(e.clientX);
  });
  bindPointer(pie, shadedFromPieEvent);

  ruler.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setShaded(shaded + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setShaded(shaded - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setShaded(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setShaded(TICKS);
    }
  });

  if (window.ResizeObserver) {
    new ResizeObserver(layoutHighlight).observe(wrap);
  } else {
    window.addEventListener("resize", layoutHighlight);
  }

  setShaded(1);
})();
