"use client";

import { useEffect, useRef } from "react";

const flowers = [
  "flower--one",
  "flower--two",
  "flower--three",
  "flower--four",
  "flower--five",
  "flower--six",
  "flower--seven",
  "flower--eight",
];

const mapLandBoundary = [
  [63, 16],
  [118, 16],
  [118, 34],
  [113, 34],
  [113, 52],
  [121, 52],
  [121, 63],
  [128, 63],
  [128, 73],
  [135, 73],
  [135, 85],
  [146, 85],
  [146, 103],
  [159, 103],
  [159, 116],
  [168, 116],
  [168, 129],
  [177, 129],
  [177, 160],
  [168, 160],
  [168, 170],
  [149, 170],
  [149, 162],
  [134, 162],
  [134, 151],
  [115, 151],
  [115, 143],
  [99, 143],
  [99, 153],
  [90, 153],
  [90, 173],
  [63, 173],
  [63, 197],
  [45, 197],
  [45, 133],
  [69, 133],
  [69, 119],
  [45, 119],
  [45, 75],
  [63, 75],
  [63, 42],
  [55, 42],
  [55, 27],
  [63, 27],
] as const;

const mapLandPath = `M${mapLandBoundary.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
const playerStart = { x: 139, y: 157 };
const particleCount = 42;

export default function Home() {
  const worldRef = useRef<HTMLElement>(null);
  const terrainRef = useRef<HTMLDivElement>(null);
  const terrainMapRef = useRef<SVGSVGElement>(null);
  const landPathRef = useRef<SVGPathElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const mapHaloRef = useRef<SVGCircleElement>(null);
  const mapMarkerRef = useRef<SVGCircleElement>(null);
  const particleRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const world = worldRef.current;
    const terrain = terrainRef.current;
    const terrainMap = terrainMapRef.current;
    const landPath = landPathRef.current;
    const player = playerRef.current;
    if (!world || !terrain || !terrainMap || !landPath || !player) return;

    const initialBounds = world.getBoundingClientRect();
    let pointerX = initialBounds.left + initialBounds.width / 2;
    let pointerY = initialBounds.top + initialBounds.height / 2;
    let velocityX = 0;
    let velocityY = 0;
    let cameraX = playerStart.x;
    let cameraY = playerStart.y;
    let frame = 0;
    let particleFrame = 0;

    const renderCamera = () => {
      const bounds = world.getBoundingClientRect();
      const mapScale = terrainMap.getBoundingClientRect().width / 200;
      if (mapScale <= 0) return;

      terrain.style.transform = `translate3d(${bounds.width / 2 - cameraX * mapScale}px, ${bounds.height / 2 - cameraY * mapScale}px, 0)`;
      mapMarkerRef.current?.setAttribute("cx", cameraX.toFixed(1));
      mapMarkerRef.current?.setAttribute("cy", cameraY.toFixed(1));
      mapHaloRef.current?.setAttribute("cx", cameraX.toFixed(1));
      mapHaloRef.current?.setAttribute("cy", cameraY.toFixed(1));
    };

    const moveTerrain = () => {
      frame = 0;
      const currentBounds = world.getBoundingClientRect();
      const pointerOffsetX =
        pointerX - currentBounds.left - currentBounds.width / 2;
      const pointerOffsetY =
        pointerY - currentBounds.top - currentBounds.height / 2;
      const pointerDistance = Math.hypot(pointerOffsetX, pointerOffsetY);
      const movementScale = Math.min(pointerDistance / 100, 1);
      const targetVelocityX =
        pointerDistance === 0
          ? 0
          : (pointerOffsetX / pointerDistance) * movementScale * 3.5;
      const targetVelocityY =
        pointerDistance === 0
          ? 0
          : (pointerOffsetY / pointerDistance) * movementScale * 3.5;

      velocityX += (targetVelocityX - velocityX) * 0.12;
      velocityY += (targetVelocityY - velocityY) * 0.12;
      const mapScale = terrainMap.getBoundingClientRect().width / 200;
      if (mapScale <= 0) return;

      const canMoveTo = (x: number, y: number) => {
        const point = new DOMPoint(x, y);
        const playerRadius = 21 / mapScale + 1.6;
        if (!landPath.isPointInFill(point)) return false;

        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
          const edgePoint = new DOMPoint(
            point.x + Math.cos(angle) * playerRadius,
            point.y + Math.sin(angle) * playerRadius,
          );
          if (!landPath.isPointInFill(edgePoint)) return false;
        }

        return true;
      };

      let nextCameraX = cameraX + velocityX / mapScale;
      let nextCameraY = cameraY + velocityY / mapScale;

      if (!canMoveTo(nextCameraX, nextCameraY)) {
        if (canMoveTo(nextCameraX, cameraY)) {
          nextCameraY = cameraY;
          velocityY = 0;
        } else if (canMoveTo(cameraX, nextCameraY)) {
          nextCameraX = cameraX;
          velocityX = 0;
        } else {
          nextCameraX = cameraX;
          nextCameraY = cameraY;
          velocityX = 0;
          velocityY = 0;
        }
      }

      cameraX = nextCameraX;
      cameraY = nextCameraY;
      renderCamera();

      if (
        Math.abs(velocityX) > 0.02 ||
        Math.abs(velocityY) > 0.02
      ) {
        frame = window.requestAnimationFrame(moveTerrain);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      const bounds = world.getBoundingClientRect();
      const directionX = pointerX - bounds.left - bounds.width / 2;
      const directionY = pointerY - bounds.top - bounds.height / 2;
      const directionLength = Math.hypot(directionX, directionY) || 1;
      player.style.setProperty("--look-x", `${(directionX / directionLength) * 1.5}px`);
      player.style.setProperty("--look-y", `${(directionY / directionLength) * 1.5}px`);

      if (!frame) frame = window.requestAnimationFrame(moveTerrain);
    };

    const handlePointerLeave = () => {
      const bounds = world.getBoundingClientRect();
      pointerX = bounds.left + bounds.width / 2;
      pointerY = bounds.top + bounds.height / 2;
      if (!frame) frame = window.requestAnimationFrame(moveTerrain);
    };

    const handleResize = () => {
      renderCamera();
      if (!frame) frame = window.requestAnimationFrame(moveTerrain);
    };

    type Particle = {
      x: number;
      y: number;
      velocityX: number;
      velocityY: number;
      respawnAt: number;
    };
    const particles: Particle[] = [];
    const randomLandPosition = () => {
      let x = 0;
      let y = 0;
      do {
        x = 45 + Math.random() * (177 - 45);
        y = 16 + Math.random() * (197 - 16);
      } while (!landPath.isPointInFill(new DOMPoint(x, y)));
      return { x, y };
    };
    const spawnParticle = (particle: Particle) => {
      const position = randomLandPosition();
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 1.4;
      particle.x = position.x;
      particle.y = position.y;
      particle.velocityX = Math.cos(angle) * speed;
      particle.velocityY = Math.sin(angle) * speed;
      particle.respawnAt = 0;
    };
    let lastParticleTime = 0;
    const animateParticles = (time: number) => {
      const deltaTime = lastParticleTime
        ? Math.min((time - lastParticleTime) / 1000, 0.05)
        : 0;
      lastParticleTime = time;

      for (let index = 0; index < particleCount; index++) {
        let particle = particles[index];
        const circle = particleRefs.current[index];
        if (!circle) continue;

        if (!particle) {
          particle = {
            x: 0,
            y: 0,
            velocityX: 0,
            velocityY: 0,
            respawnAt: 0,
          };
          particles[index] = particle;
          spawnParticle(particle);
          circle.setAttribute("r", (0.09 + Math.random() * 0.08).toFixed(3));
          circle.setAttribute("opacity", (0.28 + Math.random() * 0.3).toFixed(2));
        } else if (particle.respawnAt > 0 && time >= particle.respawnAt) {
          spawnParticle(particle);
        } else if (particle.respawnAt === 0) {
          particle.x += particle.velocityX * deltaTime;
          particle.y += particle.velocityY * deltaTime;
        }

        const visible =
          particle.respawnAt === 0 &&
          landPath.isPointInFill(new DOMPoint(particle.x, particle.y));
        circle.setAttribute("cx", particle.x.toFixed(2));
        circle.setAttribute("cy", particle.y.toFixed(2));
        circle.setAttribute("visibility", visible ? "visible" : "hidden");

        if (!visible && particle.respawnAt === 0) {
          particle.respawnAt = time + 900 + Math.random() * 1600;
        }
      }

      particleFrame = window.requestAnimationFrame(animateParticles);
    };

    world.addEventListener("pointermove", handlePointerMove);
    world.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);
    renderCamera();
    particleFrame = window.requestAnimationFrame(animateParticles);
    return () => {
      world.removeEventListener("pointermove", handlePointerMove);
      world.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      if (frame) window.cancelAnimationFrame(frame);
      if (particleFrame) window.cancelAnimationFrame(particleFrame);
    };
  }, []);

  return (
    <main className="game-world" ref={worldRef}>
      <header className="game-header">
        <div className="world-mark">
          <span className="world-mark__icon" aria-hidden="true">
            ✿
          </span>
          <div>
            <p className="world-mark__name">MEADOW</p>
            <p className="world-mark__caption">宁静草原 · 01</p>
          </div>
        </div>
        <div className="map-panel" aria-label="主地图，当前位置在训练场">
          <svg
            className="world-map"
            viewBox="0 0 200 200"
            role="img"
            aria-label="深色地图上的草地版图与绿色当前位置标记"
          >
            <rect width="200" height="200" rx="4" fill="#06151e" />
            <path d={mapLandPath} fill="#a6e8b1" />
            <path
              d={mapLandPath}
              fill="none"
              stroke="#385c42"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <path
              d={mapLandPath}
              fill="none"
              stroke="#f1ffe4"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <circle
              ref={mapHaloRef}
              className="map-player-halo"
              cx="139"
              cy="157"
              r="7"
              fill="#56d970"
              opacity="0.28"
            />
            <circle
              ref={mapMarkerRef}
              cx="139"
              cy="157"
              r="2.2"
              fill="#55dd70"
            />
          </svg>
          <div className="map-panel__caption">训练场</div>
        </div>
      </header>

      <div className="terrain-layer" ref={terrainRef} aria-hidden="true">
        <svg
          className="terrain-map"
          ref={terrainMapRef}
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="grass-shade" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#1a9e60" />
              <stop offset="1" stopColor="#178f56" />
            </linearGradient>
            <pattern
              id="grass-grain"
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="4" cy="5" r="0.8" fill="#eaffcf" opacity="0.35" />
              <circle cx="13" cy="14" r="0.7" fill="#31582a" opacity="0.24" />
            </pattern>
          </defs>
          <path
            ref={landPathRef}
            d={mapLandPath}
            fill="url(#grass-shade)"
          />
          <path d={mapLandPath} fill="url(#grass-grain)" />
          <g className="ambient-particles">
            {Array.from({ length: particleCount }, (_, index) => (
              <circle
                key={index}
                ref={(element) => {
                  particleRefs.current[index] = element;
                }}
                r="0.12"
                fill="#f2ffd9"
                opacity="0"
                visibility="hidden"
              />
            ))}
          </g>
          <path
            d={mapLandPath}
            fill="none"
            stroke="#315e3e"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d={mapLandPath}
            fill="none"
            stroke="#8bc274"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d={mapLandPath}
            fill="none"
            stroke="#efffda"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
        <div className="scene-decor">
          <div className="flowers">
            {flowers.map((flower) => (
              <div className={`flower ${flower}`} key={flower}>
                <span />
                <span />
                <span />
                <span />
                <i />
              </div>
            ))}
          </div>
          <div className="field-note">
            <span className="field-note__line" />
            <span>移动鼠标，探索草地</span>
            <span className="field-note__line" />
          </div>
        </div>
      </div>

      <div className="player" ref={playerRef} role="img" aria-label="玩家角色">
        <span className="player__eye player__eye--left">
          <i />
        </span>
        <span className="player__eye player__eye--right">
          <i />
        </span>
        <span className="player__smile" />
      </div>
    </main>
  );
}
