export function animationLoop({
  duration,
  applyFn,
  easeFn,
  onComplete,
}) {
  let start = null;

  function loop(timestamp) {
    if (start === null) {
      start = timestamp;
    }
    const progress =
      timestamp - start >= duration ? duration : timestamp - start;
    const delta = progress / duration;

    applyFn({
      progress,
      duration,
      delta: easeFn ? easeFn(delta) : delta,
    });

    if (progress < duration) {
      requestAnimationFrame(loop);
    } else if (onComplete) {
      onComplete();
    }
  }
  requestAnimationFrame(loop);
}

export function setCssVar(name, val) {
  document.documentElement.style.setProperty(`--${name}`, val);
}

export function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export const ease = {
  inOutParametric(n) {
    const sq = n ** 2;
    return sq / (2 * (sq - n) + 1);
  },
  inOutQuad(n) {
    if (n <= 0.5) {
      return 2.0 * n * n;
    }
    return 2.0 * (n - 0.5) * (1.0 - (n - 0.5)) + 0.5;
  },
  bezier(t, p1, p2) {
    const p0 = { x: 0, y: 0 };
    const p3 = { x: 1, y: 1 };

    const cX = 3 * (p1.x - p0.x);
    const bX = 3 * (p2.x - p1.x) - cX;
    const aX = p3.x - p0.x - cX - bX;

    const cY = 3 * (p1.y - p0.y);
    const bY = 3 * (p2.y - p1.y) - cY;
    const aY = p3.y - p0.y - cY - bY;

    const x = aX * t ** 3 + bX * t ** 2 + cX * t + p0.x;
    const y = aY * t ** 3 + bY * t ** 2 + cY * t + p0.y;

    return { x, y };
  },
};
