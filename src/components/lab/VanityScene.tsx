"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useTexture } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

export type VanityConfig = {
  widthCm: number;
  texture: string;
  hex: string;
  family: string;
  hardware: "brushed" | "black" | "gold";
  basin: "integrated" | "vessel" | "double";
  open: boolean;
};

const DEPTH = 0.48;
const BODY_H = 0.5;
const TOP_T = 0.028;
const GAP = 0.012; // the shadow gap the units are known for

/**
 * Laminate decors are printed at roughly this scale, so the grain stays honest
 * when the carcass grows from 80cm to 140cm instead of stretching with it.
 */
const DECOR_REPEAT = 0.62;

const HARDWARE: Record<
  VanityConfig["hardware"],
  { color: string; metalness: number; roughness: number }
> = {
  brushed: { color: "#c9ccd1", metalness: 1, roughness: 0.34 },
  black: { color: "#1b1b1b", metalness: 0.75, roughness: 0.46 },
  gold: { color: "#c6a87a", metalness: 1, roughness: 0.29 },
};

/** Gloss lacquer and ultra-matt suede are the two ends of the range. */
function surfaceOf(family: string) {
  switch (family) {
    case "gloss":
      return { roughness: 0.09, clearcoat: 0.9, clearcoatRoughness: 0.06 };
    case "matt":
    case "ultramatt":
      return { roughness: 0.88, clearcoat: 0, clearcoatRoughness: 0 };
    case "suede":
      return { roughness: 0.64, clearcoat: 0.12, clearcoatRoughness: 0.5 };
    default:
      return { roughness: 0.52, clearcoat: 0.22, clearcoatRoughness: 0.35 };
  }
}

function Panel({
  size,
  position,
  map,
  family,
  hex,
}: {
  size: [number, number, number];
  position: [number, number, number];
  map: THREE.Texture;
  family: string;
  hex: string;
}) {
  const [w, h] = size;
  const surface = surfaceOf(family);

  // Each panel gets its own clone so the repeat can match its own footprint.
  const panelMap = useMemo(() => {
    const clone = map.clone();
    clone.needsUpdate = true;
    clone.wrapS = clone.wrapT = THREE.MirroredRepeatWrapping;
    clone.repeat.set(Math.max(w / DECOR_REPEAT, 0.4), Math.max(h / DECOR_REPEAT, 0.4));
    clone.anisotropy = 8;
    return clone;
  }, [map, w, h]);

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshPhysicalMaterial map={panelMap} color={hex} {...surface} />
    </mesh>
  );
}

function Basin({ kind, width, y }: { kind: VanityConfig["basin"]; width: number; y: number }) {
  if (kind === "vessel") {
    return (
      <mesh position={[0, y + 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.15, 0.14, 48]} />
        <meshPhysicalMaterial color="#fdfdfb" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
    );
  }

  if (kind === "double") {
    const offset = Math.min(width * 0.26, 0.34);
    return (
      <>
        {[-offset, offset].map((x) => (
          <mesh key={x} position={[x, y - 0.012, 0]} receiveShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.05, 44]} />
            <meshPhysicalMaterial color="#fdfdfb" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
        ))}
      </>
    );
  }

  // Integrated: a shallow trough moulded into the top itself.
  return (
    <mesh position={[0, y - 0.012, 0]} receiveShadow>
      <cylinderGeometry args={[0.2, 0.16, 0.05, 48]} />
      <meshPhysicalMaterial color="#fdfdfb" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
    </mesh>
  );
}

function Tap({ hardware, y, x = 0 }: { hardware: VanityConfig["hardware"]; y: number; x?: number }) {
  const metal = HARDWARE[hardware];
  return (
    <group position={[x, y, -0.15]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.22, 24]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0.11, 0.055]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.013, 0.013, 0.11, 20]} />
        <meshStandardMaterial {...metal} />
      </mesh>
    </group>
  );
}

function Vanity({ config, map }: { config: VanityConfig; map: THREE.Texture }) {
  const width = config.widthCm / 100;
  const metal = HARDWARE[config.hardware];

  // A wide unit reads better as two drawers; a compact one as a single front.
  const drawers = config.widthCm >= 110 ? 2 : 1;
  const frontH = (BODY_H - GAP * (drawers + 1)) / drawers;
  const slide = config.open ? 0.26 : 0;

  return (
    <group>
      {/* carcass */}
      <mesh position={[0, BODY_H / 2, -0.02]} receiveShadow castShadow>
        <boxGeometry args={[width - 0.02, BODY_H, DEPTH - 0.04]} />
        <meshStandardMaterial color="#17181a" roughness={0.9} />
      </mesh>

      {/* drawer fronts, each sliding on its own */}
      {Array.from({ length: drawers }, (_, i) => {
        const y = BODY_H - GAP - frontH / 2 - i * (frontH + GAP);
        const push = i === 0 ? slide : slide * 0.55;
        return (
          <group key={i} position={[0, 0, push]}>
            <Panel
              size={[width - GAP * 2, frontH, 0.022]}
              position={[0, y, DEPTH / 2 - 0.011]}
              map={map}
              family={config.family}
              hex={config.hex}
            />
            {/* a bar pull, set just under the top edge of the front */}
            <mesh position={[0, y + frontH / 2 - 0.045, DEPTH / 2 + 0.012]} castShadow>
              <boxGeometry args={[Math.min(width * 0.42, 0.52), 0.012, 0.014]} />
              <meshStandardMaterial {...metal} />
            </mesh>
          </group>
        );
      })}

      {/* countertop */}
      <mesh position={[0, BODY_H + TOP_T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, TOP_T, DEPTH]} />
        <meshPhysicalMaterial color="#fbfbf9" roughness={0.18} clearcoat={0.7} clearcoatRoughness={0.12} />
      </mesh>

      <Basin kind={config.basin} width={width} y={BODY_H + TOP_T} />

      {config.basin === "double" ? (
        <>
          <Tap hardware={config.hardware} y={BODY_H + TOP_T} x={-Math.min(width * 0.26, 0.34)} />
          <Tap hardware={config.hardware} y={BODY_H + TOP_T} x={Math.min(width * 0.26, 0.34)} />
        </>
      ) : (
        <Tap hardware={config.hardware} y={BODY_H + TOP_T} />
      )}
    </group>
  );
}

function Stage({ config }: { config: VanityConfig }) {
  const map = useTexture(config.texture);
  map.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <Vanity config={config} map={map} />
      <ContactShadows
        position={[0, -0.005, 0]}
        opacity={0.33}
        scale={4}
        blur={2.6}
        far={1.4}
        resolution={512}
      />
    </>
  );
}

export function VanityScene({ config }: { config: VanityConfig }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [1.15, 0.95, 1.65], fov: 34 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ touchAction: "pan-y" }}
    >
      <color attach="background" args={["#ffffff"]} />

      {/* A three-point studio rig rather than an HDR: nothing to fetch at runtime. */}
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[2.4, 3.2, 2.2]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={9}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
      />
      <directionalLight position={[-2.6, 1.6, 1.4]} intensity={0.75} />
      <directionalLight position={[0, 1.2, -2.8]} intensity={0.5} />

      <group position={[0, -0.34, 0]}>
        <Suspense fallback={null}>
          <Stage config={config} />
        </Suspense>
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={1.3}
        maxDistance={3.4}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.08}
        target={[0, 0.02, 0]}
        makeDefault
      />
    </Canvas>
  );
}
