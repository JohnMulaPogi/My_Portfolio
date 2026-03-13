import { useEffect, useRef } from "react";

const BUBBLE_COUNT = 8;
const POP_DURATION = 460;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createBubble(width, height, compact, fromBottom = false) {
  const size = compact ? randomBetween(50, 92) : randomBetween(62, 126);
  const depth = Math.random();
  const baseVx = randomBetween(-0.12, 0.12);
  const baseVy = randomBetween(-0.24, -0.1);
  const x = randomBetween(-size * 0.14, width - size * 0.68);
  const y = fromBottom
    ? height + randomBetween(18, height * 0.28)
    : randomBetween(height * 0.08, height - size * 0.16);

  return {
    size,
    x,
    y,
    vx: baseVx,
    vy: baseVy,
    baseVx,
    baseVy,
    phase: Math.random() * Math.PI * 2,
    wobbleSpeed: randomBetween(0.00022, 0.00048),
    wobbleX: randomBetween(3, 8),
    wobbleY: randomBetween(2, 6),
    floatForce: randomBetween(0.035, 0.085),
    dragFollow: randomBetween(0.14, 0.24),
    shimmerDelay: `${randomBetween(0, 3.8).toFixed(2)}s`,
    depth,
    blurBase: compact
      ? randomBetween(0.45, 0.9)
      : randomBetween(0.35, 0.78),
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    shellTilt: 0,
    motionBlur: compact ? 0.7 : 0.55,
    popAngle: randomBetween(-16, 16),
    dragging: false,
    moved: false,
    popped: false,
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    lastPointerTime: 0,
    releaseX: 0,
    releaseY: 0,
    dragTargetX: x,
    dragTargetY: y,
  };
}

function resetBubble(bubble, width, height, compact) {
  Object.assign(bubble, createBubble(width, height, compact, true));
}

function ease(current, target, amount, dt) {
  const blend = 1 - (1 - amount) ** dt;
  return current + (target - current) * blend;
}

function syncBubbleMetrics(element, bubble) {
  element.style.width = `${bubble.size}px`;
  element.style.height = `${bubble.size}px`;
  element.style.setProperty("--bubble-depth", bubble.depth.toFixed(3));
  element.style.setProperty("--bubble-shimmer-delay", bubble.shimmerDelay);
}

function syncBubbleFrame(element, bubble) {
  element.style.setProperty(
    "--bubble-opacity",
    (0.22 + bubble.depth * 0.15).toFixed(3),
  );
  element.style.setProperty(
    "--bubble-layer-opacity",
    (0.78 + bubble.depth * 0.1).toFixed(3),
  );
  element.style.setProperty(
    "--bubble-shell-scale-x",
    bubble.scaleX.toFixed(3),
  );
  element.style.setProperty(
    "--bubble-shell-scale-y",
    bubble.scaleY.toFixed(3),
  );
  element.style.setProperty(
    "--bubble-shell-skew-x",
    `${bubble.skewX.toFixed(2)}deg`,
  );
  element.style.setProperty(
    "--bubble-shell-tilt",
    `${bubble.shellTilt.toFixed(2)}deg`,
  );
  element.style.setProperty(
    "--bubble-motion-blur",
    `${bubble.motionBlur.toFixed(2)}px`,
  );
  element.style.setProperty("--bubble-pop-angle", `${bubble.popAngle.toFixed(2)}deg`);
}

function updateBubbleShape(bubble, influenceX, influenceY, dt, dragging) {
  const absX = Math.abs(influenceX);
  const absY = Math.abs(influenceY);
  const speed = Math.hypot(influenceX, influenceY);
  const horizontal = absX >= absY;
  const stretch = dragging
    ? clamp(speed / 46, 0, 0.32)
    : clamp(speed / 18, 0, 0.16);

  let targetScaleX = 1;
  let targetScaleY = 1;

  if (horizontal) {
    targetScaleX = 1 + stretch;
    targetScaleY = 1 - stretch * 0.58;
  } else {
    targetScaleY = 1 + stretch;
    targetScaleX = 1 - stretch * 0.58;
  }

  targetScaleX = clamp(targetScaleX, 0.78, 1.32);
  targetScaleY = clamp(targetScaleY, 0.78, 1.32);

  const targetSkewX = clamp(influenceX * 0.12, -8, 8);
  const targetTilt = clamp(influenceX * 0.05 - influenceY * 0.045, -10, 10);
  const targetBlur = clamp(
    bubble.blurBase + Math.max(0, speed - 1.4) * (dragging ? 0.04 : 0.02),
    bubble.blurBase,
    dragging ? 2.6 : 1.8,
  );
  const spring = dragging ? 0.24 : 0.12;

  bubble.scaleX = ease(bubble.scaleX, targetScaleX, spring, dt);
  bubble.scaleY = ease(bubble.scaleY, targetScaleY, spring, dt);
  bubble.skewX = ease(bubble.skewX, targetSkewX, spring, dt);
  bubble.shellTilt = ease(bubble.shellTilt, targetTilt, spring, dt);
  bubble.motionBlur = ease(bubble.motionBlur, targetBlur, 0.18, dt);
}

export default function InteractiveBubbles() {
  const layerRef = useRef(null);
  const bubbleRefs = useRef([]);

  useEffect(() => {
    if (!layerRef.current) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timeouts = new Set();
    let animationFrame = 0;
    let previousTime = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let compact = width < 860 || reducedMotion;

    const bubbles = Array.from({ length: BUBBLE_COUNT }, () =>
      createBubble(width, height, compact),
    );

    function syncAllBubbleMetrics() {
      bubbleRefs.current.forEach((element, index) => {
        if (!element) return;
        syncBubbleMetrics(element, bubbles[index]);
        syncBubbleFrame(element, bubbles[index]);
      });
    }

    function renderBubble(element, bubble, time) {
      const wobbleX =
        Math.sin(time * bubble.wobbleSpeed + bubble.phase) * bubble.wobbleX;
      const wobbleY =
        Math.cos(time * bubble.wobbleSpeed * 0.84 + bubble.phase) * bubble.wobbleY;
      const rotate =
        Math.sin(time * bubble.wobbleSpeed * 0.52 + bubble.phase) * 2.4;

      element.style.transform = `translate3d(${bubble.x + wobbleX}px, ${bubble.y + wobbleY}px, 0) rotate(${rotate}deg)`;
      syncBubbleFrame(element, bubble);
    }

    function popBubble(index) {
      const element = bubbleRefs.current[index];
      const bubble = bubbles[index];
      if (!element || bubble.popped) return;

      bubble.popped = true;
      bubble.dragging = false;
      bubble.pointerId = null;
      bubble.motionBlur = Math.max(bubble.motionBlur, 1.2);
      element.classList.remove("is-dragging");
      element.classList.add("is-popping");
      syncBubbleFrame(element, bubble);

      const timeoutId = window.setTimeout(() => {
        element.classList.remove("is-popping");
        resetBubble(bubble, width, height, compact);
        syncBubbleMetrics(element, bubble);
        syncBubbleFrame(element, bubble);
        timeouts.delete(timeoutId);
      }, POP_DURATION);

      timeouts.add(timeoutId);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      compact = width < 860 || reducedMotion;

      bubbles.forEach((bubble, index) => {
        const element = bubbleRefs.current[index];
        if (!element || bubble.popped) return;

        bubble.x = clamp(bubble.x, -bubble.size * 0.2, width - bubble.size * 0.26);
        bubble.y = clamp(bubble.y, -bubble.size * 0.2, height - bubble.size * 0.18);
        bubble.motionBlur = Math.max(bubble.motionBlur, bubble.blurBase);

        syncBubbleMetrics(element, bubble);
        syncBubbleFrame(element, bubble);
      });
    }

    function animate(time) {
      const dt = previousTime ? Math.min(2, (time - previousTime) / 16.667) : 1;
      previousTime = time;

      bubbles.forEach((bubble, index) => {
        const element = bubbleRefs.current[index];
        if (!element || bubble.popped) return;

        if (bubble.dragging) {
          const dragDeltaX = bubble.dragTargetX - bubble.x;
          const dragDeltaY = bubble.dragTargetY - bubble.y;
          const follow = 1 - (1 - bubble.dragFollow) ** dt;

          bubble.x += dragDeltaX * follow;
          bubble.y += dragDeltaY * follow;
          bubble.vx = dragDeltaX * 0.18;
          bubble.vy = dragDeltaY * 0.18;

          updateBubbleShape(bubble, dragDeltaX, dragDeltaY, dt, true);
        } else {
          const sway =
            Math.sin(time * bubble.wobbleSpeed + bubble.phase) * bubble.floatForce;
          const lift =
            Math.cos(time * bubble.wobbleSpeed * 0.88 + bubble.phase) * 0.014;

          bubble.vx += (bubble.baseVx + sway - bubble.vx) * 0.04 * dt;
          bubble.vy += (bubble.baseVy + lift - bubble.vy) * 0.038 * dt;
          bubble.vx *= 0.992 ** dt;
          bubble.vy *= 0.994 ** dt;

          bubble.x += bubble.vx * dt;
          bubble.y += bubble.vy * dt;

          if (bubble.x < -bubble.size * 0.4) {
            bubble.x = width + bubble.size * 0.1;
          } else if (bubble.x > width + bubble.size * 0.12) {
            bubble.x = -bubble.size * 0.3;
          }

          if (bubble.y + bubble.size < -bubble.size * 0.16) {
            resetBubble(bubble, width, height, compact);
            syncBubbleMetrics(element, bubble);
          }

          updateBubbleShape(bubble, bubble.vx * 10, bubble.vy * 10, dt, false);
        }

        renderBubble(element, bubble, time);
      });

      animationFrame = window.requestAnimationFrame(animate);
    }

    function handlePointerDown(index, event) {
      const bubble = bubbles[index];
      const element = bubbleRefs.current[index];
      if (!bubble || !element || bubble.popped) return;

      bubble.dragging = true;
      bubble.moved = false;
      bubble.pointerId = event.pointerId;
      bubble.offsetX = event.clientX - bubble.x;
      bubble.offsetY = event.clientY - bubble.y;
      bubble.lastPointerX = event.clientX;
      bubble.lastPointerY = event.clientY;
      bubble.lastPointerTime = performance.now();
      bubble.releaseX = 0;
      bubble.releaseY = 0;
      bubble.dragTargetX = bubble.x;
      bubble.dragTargetY = bubble.y;

      element.classList.add("is-dragging");
      element.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(index, event) {
      const bubble = bubbles[index];
      if (!bubble || !bubble.dragging || bubble.pointerId !== event.pointerId) return;

      const now = performance.now();
      const deltaX = event.clientX - bubble.lastPointerX;
      const deltaY = event.clientY - bubble.lastPointerY;
      const deltaTime = Math.max(now - bubble.lastPointerTime, 1);

      bubble.dragTargetX = clamp(
        event.clientX - bubble.offsetX,
        -bubble.size * 0.2,
        width - bubble.size * 0.22,
      );
      bubble.dragTargetY = clamp(
        event.clientY - bubble.offsetY,
        -bubble.size * 0.2,
        height - bubble.size * 0.22,
      );

      bubble.releaseX = (deltaX / deltaTime) * 16.667;
      bubble.releaseY = (deltaY / deltaTime) * 16.667;
      bubble.lastPointerX = event.clientX;
      bubble.lastPointerY = event.clientY;
      bubble.lastPointerTime = now;

      if (Math.abs(deltaX) + Math.abs(deltaY) > 2.6) {
        bubble.moved = true;
      }
    }

    function endPointer(index, event) {
      const bubble = bubbles[index];
      const element = bubbleRefs.current[index];
      if (!bubble || !element || bubble.pointerId !== event.pointerId) return;

      element.classList.remove("is-dragging");
      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      bubble.dragging = false;
      bubble.pointerId = null;

      if (!bubble.moved) {
        popBubble(index);
        return;
      }

      bubble.vx = clamp(bubble.releaseX * 0.56, -3.8, 3.8);
      bubble.vy = clamp(bubble.releaseY * 0.56, -3.8, 2.6);
      bubble.popAngle = clamp(
        bubble.releaseX * 1.2 - bubble.releaseY * 0.8,
        -18,
        18,
      );
    }

    const cleanups = bubbleRefs.current.map((element, index) => {
      if (!element) return () => {};

      const pointerDown = (event) => handlePointerDown(index, event);
      const pointerMove = (event) => handlePointerMove(index, event);
      const pointerUp = (event) => endPointer(index, event);
      const pointerCancel = (event) => endPointer(index, event);

      element.addEventListener("pointerdown", pointerDown);
      element.addEventListener("pointermove", pointerMove);
      element.addEventListener("pointerup", pointerUp);
      element.addEventListener("pointercancel", pointerCancel);

      return () => {
        element.removeEventListener("pointerdown", pointerDown);
        element.removeEventListener("pointermove", pointerMove);
        element.removeEventListener("pointerup", pointerUp);
        element.removeEventListener("pointercancel", pointerCancel);
      };
    });

    syncAllBubbleMetrics();
    animationFrame = window.requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      cleanups.forEach((cleanup) => cleanup());
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  return (
    <div className="bubble-layer" ref={layerRef} aria-hidden="true">
      {Array.from({ length: BUBBLE_COUNT }, (_, index) => (
        <button
          key={index}
          type="button"
          className="interactive-bubble"
          ref={(element) => {
            bubbleRefs.current[index] = element;
          }}
          tabIndex={-1}
        >
          <span className="interactive-bubble-shell">
            <span className="bubble-rim" />
            <span className="bubble-highlight bubble-highlight-main" />
            <span className="bubble-highlight bubble-highlight-soft" />
            <span className="bubble-caustic" />
            <span className="bubble-shadow" />
            <span className="bubble-pop-flash" />
            <span className="bubble-pop-fragment bubble-pop-fragment-1" />
            <span className="bubble-pop-fragment bubble-pop-fragment-2" />
            <span className="bubble-pop-fragment bubble-pop-fragment-3" />
            <span className="bubble-pop-ring" />
          </span>
        </button>
      ))}
    </div>
  );
}
