import { useEffect, useRef } from "react";

function createParticles(width, height, reducedMotion) {
  const density = reducedMotion ? 42000 : 32000;
  const minCount = reducedMotion ? 18 : 28;
  const maxCount = reducedMotion ? 32 : 66;
  const count = Math.max(
    minCount,
    Math.min(maxCount, Math.round((width * height) / density)),
  );

  return Array.from({ length: count }, () => {
    const anchorX = Math.random() * width;
    const anchorY = Math.random() * height;

    return {
      anchorX,
      anchorY,
      x: anchorX,
      y: anchorY,
      radius: Math.random() * 1.7 + 0.9,
      spread: Math.random() * 18 + 8,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.00045 + 0.00022,
      easing: Math.random() * 0.022 + 0.026,
    };
  });
}

function readPalette() {
  const styles = getComputedStyle(document.documentElement);
  const getValue = (name, fallback) =>
    styles.getPropertyValue(name).trim() || fallback;

  return {
    dot: getValue("--constellation-dot", "rgba(226, 232, 240, 0.75)"),
    line: getValue("--constellation-line", "rgba(148, 163, 184, 0.2)"),
    glow: getValue("--constellation-glow", "rgba(34, 211, 238, 0.16)"),
    pointer: getValue("--constellation-pointer", "rgba(34, 211, 238, 0.1)"),
  };
}

export default function InteractiveConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let palette = readPalette();
    let particles = [];

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = createParticles(width, height, prefersReducedMotion);
    }

    function updatePointer(event) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    }

    function deactivatePointer() {
      pointer.active = false;
    }

    function handleMouseOut(event) {
      if (!event.relatedTarget) deactivatePointer();
    }

    function drawPointerGlow() {
      if (!pointer.active) return;

      const glowRadius = prefersReducedMotion ? 88 : 118;
      const gradient = context.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        glowRadius,
      );

      gradient.addColorStop(0, palette.pointer);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.save();
      context.fillStyle = gradient;
      context.fillRect(
        pointer.x - glowRadius,
        pointer.y - glowRadius,
        glowRadius * 2,
        glowRadius * 2,
      );
      context.restore();
    }

    function updateParticles(time) {
      const influenceRadius = prefersReducedMotion
        ? 74
        : 108;

      particles.forEach((particle) => {
        const waveX =
          Math.cos(time * particle.speed + particle.phase) * particle.spread;
        const waveY =
          Math.sin(time * particle.speed * 1.18 + particle.phase) *
          particle.spread;

        let targetX = particle.anchorX + waveX;
        let targetY = particle.anchorY + waveY;

        if (pointer.active) {
          const deltaX = pointer.x - particle.x;
          const deltaY = pointer.y - particle.y;
          const distance = Math.hypot(deltaX, deltaY) || 1;

          if (distance < influenceRadius) {
            const pull = ((influenceRadius - distance) / influenceRadius) ** 1.7;
            const clusterStrength = Math.min(0.62, 0.12 + pull * 0.5);
            targetX = targetX * (1 - clusterStrength) + pointer.x * clusterStrength;
            targetY = targetY * (1 - clusterStrength) + pointer.y * clusterStrength;
          }
        }

        particle.x += (targetX - particle.x) * particle.easing;
        particle.y += (targetY - particle.y) * particle.easing;
      });
    }

    function drawConnections() {
      const connectionDistance = pointer.active
        ? prefersReducedMotion
          ? 92
          : 124
        : prefersReducedMotion
          ? 84
          : 116;

      context.save();
      context.strokeStyle = palette.line;
      context.lineWidth = 1;

      for (let index = 0; index < particles.length; index += 1) {
        const first = particles[index];

        for (let next = index + 1; next < particles.length; next += 1) {
          const second = particles[next];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);

          if (distance > connectionDistance) continue;

          const opacity = ((connectionDistance - distance) / connectionDistance) ** 1.7;
          context.globalAlpha = opacity * 0.9;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }

      context.restore();
    }

    function drawParticles() {
      context.save();
      context.fillStyle = palette.dot;
      context.shadowBlur = 18;
      context.shadowColor = palette.glow;

      particles.forEach((particle) => {
        context.globalAlpha = Math.min(0.92, 0.48 + particle.radius * 0.16);
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.restore();
    }

    function render(time) {
      context.clearRect(0, 0, width, height);
      drawPointerGlow();
      updateParticles(time);
      drawConnections();
      drawParticles();
      frameId = window.requestAnimationFrame(render);
    }

    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resizeCanvas();
    frameId = window.requestAnimationFrame(render);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerdown", updatePointer, { passive: true });
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("blur", deactivatePointer);

    return () => {
      window.cancelAnimationFrame(frameId);
      themeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("blur", deactivatePointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-constellation" aria-hidden="true" />;
}
