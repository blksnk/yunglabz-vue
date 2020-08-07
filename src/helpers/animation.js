export function animationLoop(duration, callback, easeFunc) {
  let start = null;

  function loop(timestamp) {
    if (start === null) {
      start = timestamp;
    }
    const progress =
      timestamp - start >= duration ? duration : timestamp - start;
    const delta = progress / duration;

    callback({
      progress,
      duration,
      delta: easeFunc ? easeFunc(delta) : delta,
    });

    if (progress < duration) {
      requestAnimationFrame(loop);
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
    const sq = n * n;
    return sq / (2 * (sq - n) + 1);
  },
  inOutQuad(n) {
    if (n <= 0.5) {
      return 2.0 * n * n;
    }
    return 2.0 * (n - 0.5) * (1.0 - (n - 0.5)) + 0.5;
  },
};
