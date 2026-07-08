"use client";
import { MediaDisplay } from "@/components/ui/MediaDisplay";


import "@/app/templates.css";

/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { Environment, Html, OrbitControls, Text, Text3D, Center, Float, useAnimations, useGLTF } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import type { BirthdayMagicExperienceProps, BirthdayPhase, MaterialTone } from "./types";
import { MODELS, FIRST_PAINT_MODELS, DEFAULT_BIRTHDAY_MUSIC, TOUCH_SOUND } from "./models";

// Preload critical models to prevent lag during interactions
if (typeof window !== "undefined") {
  useGLTF.preload(MODELS.cat);
  useGLTF.preload(MODELS.catWalk);
  useGLTF.preload(MODELS.gramophone);
  useGLTF.preload(MODELS.balloons);
  useGLTF.preload(MODELS.balloonSingle);
  // THÊM 5 DÒNG NÀY ĐỂ FIX LỖI ĐEN MÀN HÌNH:
  useGLTF.preload(MODELS.cake);
  useGLTF.preload(MODELS.candle);
  useGLTF.preload(MODELS.matchbox);
  useGLTF.preload(MODELS.matchstick);
  useGLTF.preload(MODELS.lootBox);
  useGLTF.preload(MODELS.magicWand);
  useGLTF.preload(MODELS.hat);
  useGLTF.preload(MODELS.fire);
  useGLTF.preload(MODELS.giftBox);
}

export function prepareScene(scene: THREE.Object3D, materialTone?: MaterialTone, noClone: boolean = false) {
  const objectToUse = noClone ? scene : SkeletonUtils.clone(scene);
  objectToUse.traverse((object: any) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.material) {
        if (object.material.clone) object.material = object.material.clone();
        if ((materialTone === "switch" || materialTone === "switch-single")) {
          object.material.color?.set("#fff7ff");
          object.material.emissive?.set("#ff9fda");
          object.material.emissiveIntensity = 0.55;
          object.material.roughness = 0.38;
          object.material.metalness = 0.04;
        }
        if (materialTone === "glow") {
          object.material.emissive?.set("#ffb8e8");
          object.material.emissiveIntensity = 0.22;
        }
        if (materialTone === "fire") {
          object.material.color?.set("#ffffff");
          object.material.emissive?.set("#ffbd6f");
          object.material.emissiveIntensity = 2.0;
          object.material.transparent = true;
        }
      }
    }
  });
  if (materialTone === "switch-single") {
    const sceneBox = new THREE.Box3().setFromObject(objectToUse);
    const centerX = sceneBox.getCenter(new THREE.Vector3()).x;
    objectToUse.traverse((object: any) => {
      if (!object.isMesh) return;
      const box = new THREE.Box3().setFromObject(object);
      if (box.getCenter(new THREE.Vector3()).x < centerX) object.visible = false;
    });
  }
  return objectToUse;
}

function playFirstAnimation(actions: Record<string, THREE.AnimationAction | null>, options?: { loop?: boolean; clamp?: boolean }) {
  console.log("playFirstAnimation called with actions:", Object.keys(actions), "options:", options);
  Object.values(actions).forEach((action) => {
    if (!action) {
      console.log("action is null or undefined");
      return;
    }
    console.log("Playing action:", action.getClip().name);
    action.reset();
    action.setLoop(options?.loop ? THREE.LoopRepeat : THREE.LoopOnce, options?.loop ? Infinity : 1);
    action.clampWhenFinished = options?.clamp ?? !options?.loop;
    action.play();
  });
}

function LoadedModel({
  onClick,
  playSignal = 0,
  loop = false,
  materialTone,
  noClone = false,
  url,
  ...props
}: {
  onClick?: () => void;
  playSignal?: number;
  loop?: boolean;
  materialTone?: MaterialTone;
  noClone?: boolean;
  url: string;
} & ThreeElements["group"]) {
  const gltf = useGLTF(url) as any;
  const scene = useMemo(() => prepareScene(gltf.scene, materialTone, noClone), [gltf.scene, materialTone, noClone]);

  // Create a mixer for this scene instance
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  // Update mixer on every frame
  useFrame((state, delta) => {
    mixer.update(delta);
  });

  // Keep track of active actions
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});

  useEffect(() => {
    if (!gltf.animations || gltf.animations.length === 0) return;
    
    // Create/get actions
    gltf.animations.forEach((clip: THREE.AnimationClip) => {
      if (!actionsRef.current[clip.name]) {
        actionsRef.current[clip.name] = mixer.clipAction(clip, scene);
      }
    });

    const actions = actionsRef.current;

    if (loop) {
      Object.values(actions).forEach((action) => {
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
      });
    } else {
      Object.values(actions).forEach((action) => {
        action.stop();
      });
    }

    return () => {
      Object.values(actions).forEach((action) => {
        action.stop();
      });
    };
  }, [mixer, gltf.animations, loop, scene]);

  useEffect(() => {
    if (playSignal > 0 && gltf.animations && gltf.animations.length > 0) {
      Object.values(actionsRef.current).forEach((action) => {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      });
    }
  }, [playSignal, gltf.animations]);

  return (
    <group onClick={(event) => { if (onClick) { event.stopPropagation(); onClick(); } }} {...props}>
      <primitive object={scene} />
    </group>
  );
}

function ModelFallback(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#ff9fda" emissive="#8f4ca8" emissiveIntensity={0.16} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.32, 0.18, 24]} />
        <meshStandardMaterial color="#fff2fb" roughness={0.72} />
      </mesh>
    </group>
  );
}

export function Model({
  onClick,
  playSignal,
  loop,
  materialTone,
  noClone = true,
  url,
  ...groupProps
}: {
  onClick?: () => void;
  playSignal?: number;
  loop?: boolean;
  materialTone?: MaterialTone;
  noClone?: boolean;
  url: string;
} & ThreeElements["group"]) {
  return (
    <Suspense
      fallback={
        <ModelFallback
          {...groupProps}
          onClick={onClick ? (event: any) => { event.stopPropagation(); onClick(); } : undefined}
        />
      }
    >
      <LoadedModel onClick={onClick} playSignal={playSignal} loop={loop} materialTone={materialTone} noClone={noClone} url={url} {...groupProps} />
    </Suspense>
  );
}

function LoadedNormalizedModel({
  desiredHeight = 2.5,
  fit = "height",
  url,
  loop = true,
  materialTone,
  noClone = false,
  onClick,
  playSignal = 0,
  ...props
}: {
  desiredHeight?: number;
  fit?: "height" | "max";
  url: string;
  loop?: boolean;
  materialTone?: MaterialTone;
  noClone?: boolean;
  onClick?: () => void;
  playSignal?: number;
} & ThreeElements["group"]) {
  const gltf = useGLTF(url) as any;
  const { scene, offset, scale } = useMemo(() => {
    // SỬA Ở ĐÂY: Xóa dòng SkeletonUtils.clone() bị lỗi. Truyền thẳng gltf.scene và biến noClone
    // Điều này giúp Mèo giữ được bộ xương (bones) và di chuyển chân mượt mà!
    const objectToUse = prepareScene(gltf.scene, materialTone, noClone);
    
    const box = new THREE.Box3().setFromObject(objectToUse);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const safeSize = fit === "max" ? Math.max(size.x, size.y, size.z, 0.001) : Math.max(size.y, 0.001);
    return {
      scene: objectToUse,
      offset: center.multiplyScalar(-1),
      scale: desiredHeight / safeSize,
    };
  }, [desiredHeight, fit, gltf.scene, materialTone]);

  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});

  useEffect(() => {
    if (!gltf.animations || gltf.animations.length === 0) return;
    
    gltf.animations.forEach((clip: THREE.AnimationClip) => {
      if (!actionsRef.current[clip.name]) {
        actionsRef.current[clip.name] = mixer.clipAction(clip, scene);
      }
    });

    const actions = actionsRef.current;

    if (loop) {
      Object.values(actions).forEach((action) => {
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
      });
    } else {
      Object.values(actions).forEach((action) => {
        action.stop();
      });
    }

    return () => {
      Object.values(actions).forEach((action) => {
        action.stop();
      });
    };
  }, [mixer, gltf.animations, loop, scene]);

  useEffect(() => {
    if (playSignal > 0 && gltf.animations && gltf.animations.length > 0) {
      Object.values(actionsRef.current).forEach((action) => {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      });
    }
  }, [playSignal, gltf.animations]);

  return (
    <group onClick={(event) => { if (onClick) { event.stopPropagation(); onClick(); } }} {...props}>
      <group scale={scale}>
        <group position={offset}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

export function NormalizedModel({
  materialTone,
  noClone,
  onClick,
  playSignal,
  ...props
}: {
  desiredHeight?: number;
  fit?: "height" | "max";
  url: string;
  loop?: boolean;
  materialTone?: MaterialTone;
  noClone?: boolean;
  onClick?: () => void;
  playSignal?: number;
} & ThreeElements["group"]) {
  return (
    <Suspense fallback={<ModelFallback position={props.position} rotation={props.rotation} scale={props.scale} />}>
      <LoadedNormalizedModel materialTone={materialTone} noClone={noClone} onClick={onClick} playSignal={playSignal} {...props} />
    </Suspense>
  );
}


function LoadedDebugNormalizedModel({
  desiredSize = 1,
  url,
  ...props
}: {
  desiredSize?: number;
  url: string;
} & ThreeElements["group"]) {
  const gltf = useGLTF(url) as any;
  const { scene, offset, scale, size } = useMemo(() => {
    const cloned = prepareScene(gltf.scene, "glow", false);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const modelSize = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(modelSize.x, modelSize.y, modelSize.z, 0.001);
    return {
      scene: cloned,
      offset: center.multiplyScalar(-1),
      scale: desiredSize / maxSize,
      size: modelSize,
    };
  }, [desiredSize, gltf.scene]);


  return (
    <group {...props}>
      <group scale={scale}>
        <primitive object={scene} position={offset} />
        <mesh>
          <boxGeometry args={[size.x, size.y, size.z]} />
          <meshBasicMaterial color="#ffe25d" transparent opacity={0.16} wireframe />
        </mesh>
      </group>
    </group>
  );
}

function DebugNormalizedModel(props: {
  desiredSize?: number;
  url: string;
} & ThreeElements["group"]) {
  return (
    <Suspense fallback={<ModelFallback position={props.position} rotation={props.rotation} scale={props.scale} />}>
      <LoadedDebugNormalizedModel {...props} />
    </Suspense>
  );
}

function TimelineText({
  children,
  position,
  color = "#3a163a",
}: {
  children: string;
  position: [number, number, number];
  color?: string;
}) {
  return (
    <Text
      anchorX="center"
      anchorY="middle"
      color={color}
      fontSize={0.24}
      maxWidth={4}
      outlineColor="#fff7ff"
      outlineWidth={0.028}
      position={position}
    >
      {children}
    </Text>
  );
}

export function DreamLights({ active, phase }: { active: boolean; phase?: string }) {
  // TẮT SẠCH ĐÈN Ở MÀN QUẸT DIÊM ĐỂ CÓ BÓNG TỐI SOLID 100%
  const isPitchBlack = phase === "match-ignite" || phase === "wish-record";
  if (isPitchBlack) return <ambientLight intensity={0} />;

  return (
    <>
      <ambientLight intensity={active ? 1.45 : 0.25} />
      <directionalLight castShadow intensity={active ? 2.25 : 0.45} position={[3, 5, 4]} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001}>
        <orthographicCamera attach="shadow-camera" args={[-6, 6, 6, -6, 0.5, 15]} />
      </directionalLight>
      <pointLight color="#ff7fc7" intensity={active ? 7.8 : 2.2} distance={8} position={[-2.6, 2.8, 2.4]} />
      <pointLight color="#b78cff" intensity={active ? 6.4 : 1.6} distance={8} position={[2.8, 2.2, 2.2]} />
      <pointLight color="#fff0b8" intensity={active ? 5.5 : 1.8} distance={7} position={[0, 3.5, -1]} />
      <spotLight angle={0.55} color="#fff7fb" intensity={active ? 3.6 : 1.1} penumbra={0.9} position={[0, 4.8, 2.2]} />
    </>
  );
}

export function CameraRig({
  enabled = true, musicActive, phase, celebrationZoom, giftZoomInside, vintageElapsed, memoriesCount = 4
}: {
  enabled?: boolean; musicActive: boolean; phase: BirthdayPhase; celebrationZoom: boolean; giftZoomInside: boolean; vintageElapsed: number; memoriesCount?: number;
}) {
  const { camera } = useThree();
  const lookY = useRef(0.55);
  const lookX = useRef(0.0);

  useFrame((state, rawDelta) => {
    if (!enabled) return;
    const delta = Math.min(rawDelta, 0.05); // clamp delta để tránh tab-switch glitch
    const targetCameraPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3(0, lookY.current, 0);
    let lerpSpeed = 1.2; let lookLerpSpeed = 1.5;

    if (phase === "dark") {
      targetCameraPos.set(0, 0.0, 3.5); lookY.current = 0.0; lookX.current = 0;
    } else if (phase === "music") {
      targetCameraPos.set(0, musicActive ? 0.8 : 1.0, musicActive ? 3.0 : 3.5);
      lookY.current = musicActive ? -0.5 : -0.3; lookX.current = 0;
    } else if (phase === "decorate-popup") {
      targetCameraPos.set(0, 0.8, 3.2);
      lookY.current = -0.3; lookX.current = 0;
    } else if (phase === "cake-messages") {
      targetCameraPos.set(0, 0.5, 8.5); lookY.current = -0.3; lookX.current = 0;
    } else if (phase === "match-ignite") {
      targetCameraPos.set(0, 1.4, 2.8); lookY.current = 1.3; lookX.current = 0;
    } else if (phase === "wish-record") {
      targetCameraPos.set(0, 1.15, 4.2); lookY.current = 1.2; lookX.current = 0;
    } else if (phase === "celebration") {
      if (celebrationZoom) {
        targetCameraPos.set(1.6, -1.2, 7.0); lookY.current = -1.75; lookX.current = 1.6;
        lerpSpeed = 2.0; lookLerpSpeed = 2.0;
      } else {
        targetCameraPos.set(0, 0.5, 5.5); lookY.current = -0.5; lookX.current = 0;
        lerpSpeed = 2.0; lookLerpSpeed = 2.0;
      }
    } else if (phase === "gift-reveal") {
      if (giftZoomInside) {
        targetCameraPos.set(1.6, -1.2, 2.5);
        camera.position.lerp(targetCameraPos, delta * 6);
      } else {
        targetCameraPos.set(1.6, -1.2, 3.8);
        camera.position.lerp(targetCameraPos, delta * 4);
      }
      camera.lookAt(1.6, -1.75, 1.4); 
      return; 
    } else if (phase === "vintage-gallery" || phase === "end") {
      const finalX = memoriesCount * 3.5 + 0.25;  // This matches startX=-1.5 + 1.5 offset + memories span
      const t = Math.min(1, vintageElapsed / 15.0); const xPos = -1.5 + t * (finalX + 1.5); 
      camera.position.set(xPos, vintageElapsed > 25.0 ? 0.9 + Math.min(1, (vintageElapsed - 25.0) / 4.0) * 5.0 : 0.9, 7.0);
      camera.lookAt(xPos, vintageElapsed > 25.0 ? 0.9 + Math.min(1, (vintageElapsed - 25.0) / 4.0) * 5.0 : 0.9, 0); return;
    }
    
    targetLookAt.set(lookX.current, lookY.current, 0);
    camera.position.lerp(targetCameraPos, delta * lerpSpeed);
    const currentLookAt = new THREE.Vector3(); camera.getWorldDirection(currentLookAt);
    currentLookAt.add(camera.position).lerp(targetLookAt, delta * lookLerpSpeed); camera.lookAt(currentLookAt);
  });
  return null;
}

function SparkleBurst({ signal }: { signal: number }) {
  const group = useRef<THREE.Group>(null);
  const start = useRef(0);
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        angle: (index / 18) * Math.PI * 2,
        speed: 0.45 + (index % 5) * 0.08,
        size: 0.035 + (index % 3) * 0.012,
        color: ["#fff4a8", "#ff8fd1", "#b78cff", "#ffffff"][index % 4],
      })),
    [],
  );

  useEffect(() => {
    if (signal > 0) start.current = performance.now();
  }, [signal]);

  useFrame(() => {
    if (!group.current) return;
    const elapsed = (performance.now() - start.current) / 1000;
    group.current.visible = signal > 0 && elapsed < 1.05;
    group.current.children.forEach((child, index) => {
      const spark = sparks[index];
      const distance = elapsed * spark.speed;
      child.position.set(Math.cos(spark.angle) * distance, Math.sin(spark.angle) * distance, 0.08);
      child.scale.setScalar(Math.max(0.01, 1 - elapsed * 0.82));
    });
  });

  return (
    <group ref={group}>
      {sparks.map((spark, index) => (
        <mesh key={index}>
          <sphereGeometry args={[spark.size, 12, 12]} />
          <meshBasicMaterial color={spark.color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroLightSwitch({ onClick, signal }: { onClick: () => void; signal: number }) {
  const group = useRef<THREE.Group>(null);
  const lever = useRef<THREE.Mesh>(null);
  const topHalf = useRef<THREE.Mesh>(null);
  const bottomHalf = useRef<THREE.Mesh>(null);
  const start = useRef(0);

  useEffect(() => {
    if (signal > 0) start.current = performance.now();
  }, [signal]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const elapsed = (performance.now() - start.current) / 1000;
    const active = signal > 0 && elapsed < 1.2;
    const bounce = active ? Math.sin(elapsed * 20) * Math.max(0, 1 - elapsed / 1.2) : 0;
    group.current.scale.lerp(new THREE.Vector3(1 + bounce * 0.045, 1 - bounce * 0.035, 1), delta * 12);
    if (lever.current) {
      lever.current.rotation.x = THREE.MathUtils.lerp(lever.current.rotation.x, active ? -0.28 : 0.12, delta * 10);
      lever.current.position.z = THREE.MathUtils.lerp(lever.current.position.z, active ? 0.2 : 0.16, delta * 10);
    }
    if (topHalf.current) {
      topHalf.current.position.z = THREE.MathUtils.lerp(topHalf.current.position.z, active ? 0.09 : 0.17, delta * 10);
    }
    if (bottomHalf.current) {
      bottomHalf.current.position.z = THREE.MathUtils.lerp(bottomHalf.current.position.z, active ? 0.22 : 0.12, delta * 10);
    }
  });

  return (
    <group ref={group} onClick={(event) => { event.stopPropagation(); onClick(); }} position={[0, -0.04, 0]} scale={1.32}>
      <pointLight color="#ff8fd1" distance={4.5} intensity={5.5} position={[0, 0.15, 0.9]} />
      <mesh position={[0.14, -0.15, -0.23]}>
        <boxGeometry args={[1.02, 1.55, 0.05]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.34} />
      </mesh>
      <mesh position={[0.04, -0.72, -0.18]} rotation={[-0.1, 0, 0]}>
        <circleGeometry args={[0.62, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.24} />
      </mesh>
      <mesh position={[0.05, -0.06, -0.13]}>
        <boxGeometry args={[0.9, 1.42, 0.08]} />
        <meshStandardMaterial color="#2a0d30" transparent opacity={0.5} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, -0.04]} receiveShadow>
        <boxGeometry args={[0.86, 1.36, 0.12]} />
        <meshStandardMaterial color="#fff8ff" emissive="#ff9fda" emissiveIntensity={0.12} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, -0.105]}>
        <boxGeometry args={[0.98, 1.48, 0.08]} />
        <meshStandardMaterial color="#a94fa0" emissive="#522058" emissiveIntensity={0.18} roughness={0.7} />
      </mesh>
      <mesh ref={lever} position={[0, 0, 0.14]} castShadow rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.42, 0.86, 0.12]} />
        <meshStandardMaterial color="#ffdff3" emissive="#ff7fc7" emissiveIntensity={0.22} roughness={0.38} />
      </mesh>
      <mesh position={[0.045, -0.045, 0.09]}>
        <boxGeometry args={[0.43, 0.88, 0.02]} />
        <meshBasicMaterial color="#9b2d83" transparent opacity={0.22} />
      </mesh>
      <mesh ref={topHalf} position={[0, 0.23, 0.17]} castShadow>
        <boxGeometry args={[0.35, 0.36, 0.08]} />
        <meshStandardMaterial color="#fff4fb" emissive="#ff9fda" emissiveIntensity={0.18} roughness={0.36} />
      </mesh>
      <mesh ref={bottomHalf} position={[0, -0.23, 0.12]} castShadow>
        <boxGeometry args={[0.35, 0.36, 0.08]} />
        <meshStandardMaterial color="#ffc5e7" emissive="#ff66bd" emissiveIntensity={0.26} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0, 0.235]}>
        <boxGeometry args={[0.36, 0.025, 0.012]} />
        <meshBasicMaterial color="#d95ca8" />
      </mesh>
      <mesh position={[0, 0.54, 0.05]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#ff7fc7" />
      </mesh>
      <mesh position={[0, -0.54, 0.05]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#ff7fc7" />
      </mesh>
      <SparkleBurst signal={signal} />
    </group>
  );
}

export function ComicCallout({
  children,
  exitSignal = 0,
  onClick,
  position,
  fullscreen,
}: {
  children: React.ReactNode;
  exitSignal?: number;
  onClick?: () => void;
  position?: [number, number, number];
  fullscreen?: boolean;
}) {
  const [hidden, setHidden] = useState(false);


  useEffect(() => {
    if (exitSignal <= 0) return;
    setHidden(false);
    const timer = window.setTimeout(() => setHidden(true), 520);
    return () => window.clearTimeout(timer);
  }, [exitSignal]);

  if (hidden) return null;

  const bubble = (
    <motion.button
      animate={exitSignal > 0 ? { rotate: [0, -7, 7, -4, 0], scale: [1, 1.08, 0.72, 0], opacity: [1, 1, 0.9, 0] } : { rotate: [-1.8, 1.8, -1.8], scale: [1, 1.04, 1], y: [0, -4, 0] }}
      className="relative min-w-32 border-[3px] border-[#241126] bg-[#ffe36e] px-5 py-2.5 text-lg font-black uppercase tracking-[0.04em] text-[#241126] shadow-[6px_6px_0_#241126]"
      onClick={onClick}
      style={{
        clipPath: "polygon(0 8%, 96% 0, 100% 80%, 74% 78%, 65% 100%, 56% 78%, 4% 86%)",
      }}
      transition={exitSignal > 0 ? { duration: 0.52, ease: "easeInOut" } : { duration: 1.25, ease: "easeInOut", repeat: Infinity }}
      type="button"
    >
      {children}
    </motion.button>
  );

  if (fullscreen) {
    return (
      <Html fullscreen zIndexRange={[30, 20]}>
        <div className="pointer-events-none absolute inset-0">
          <div className="pointer-events-auto absolute left-[57%] top-[33%] -translate-y-1/2">{bubble}</div>
        </div>
      </Html>
    );
  }

  return (
    <Html center position={position}>
      {bubble}
    </Html>
  );
}

export function MessageCycle({
  messages,
  onDone,
  running,
}: {
  messages: string[];
  onDone?: () => void;
  running: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running) {
      setIndex(0);
      return;
    }

    if (index >= messages.length) {
      onDone?.();
      return;
    }

    const timer = window.setTimeout(() => setIndex((current) => current + 1), 3600);
    return () => window.clearTimeout(timer);
  }, [index, messages.length, onDone, running]);

  if (!running && index === 0) return null;

  return (
    <Html fullscreen zIndexRange={[75, 65]}>
      <AnimatePresence mode="wait">
        {running && index < messages.length ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="birthday-message-bubble pointer-events-none absolute left-1/2 top-[13%] max-w-[82%] -translate-x-1/2 px-3 py-2 text-center text-lg font-black drop-shadow-[0_3px_8px_rgba(122,62,0,0.24)]"
            exit={{ opacity: 0, scale: 0.96, y: -10, transition: { duration: 0.15 } }}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            key={index}
            style={{ color: "#ffd34d" }}
            transition={{ duration: 0.55 }}
          >
            {messages[index]}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Html>
  );
}

export function CakeBackgroundEffects({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const dotsGroup = useRef<THREE.Group>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        x: -2.55 + (index % 7) * 0.82,
        y: -0.25 + Math.floor(index / 7) * 0.43,
        z: -1.65 - (index % 4) * 0.1,
        size: 0.025 + (index % 4) * 0.012,
        color: ["#ffffff", "#ff9fd2", "#c7a5ff", "#fff1a8"][index % 4],
        phase: index * 0.48,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.visible = active;
    dotsGroup.current?.children.forEach((child, index) => {
      const dot = dots[Math.min(index, dots.length - 1)];
      child.position.y = dot.y + Math.sin(state.clock.elapsedTime * 0.9 + dot.phase) * 0.08;
      child.scale.setScalar(0.7 + Math.sin(state.clock.elapsedTime * 2.4 + dot.phase) * 0.22);
    });
  });

  return (
    <group ref={group}>
      <group ref={dotsGroup}>
        {dots.map((dot, index) => (
          <mesh key={index} position={[dot.x, dot.y, dot.z]}>
            <sphereGeometry args={[dot.size, 12, 12]} />
            <meshBasicMaterial color={dot.color} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      <group position={[0, 0, 0]}>
        <Float speed={2.5} rotationIntensity={0.2} floatIntensity={1.5}>
          <NormalizedModel loop desiredHeight={5.0} position={[-3.2, 0.8, -2.5]} rotation={[0, 0.4, 0]} url={MODELS.balloons} />
          <NormalizedModel loop desiredHeight={5.0} position={[3.5, 1.0, -3.0]} rotation={[0, -0.2, 0]} url={MODELS.balloons} />
          <NormalizedModel loop={false} desiredHeight={2.5} position={[-2.0, 2.8, -2.0]} rotation={[0, 0.1, 0]} url={MODELS.balloonSingle} />
          <NormalizedModel loop={false} desiredHeight={2.5} position={[2.5, 3.0, -2.5]} rotation={[0, -0.3, 0]} url={MODELS.balloonSingle} />
        </Float>
      </group>
    </group>
  );
}

export function FloatingBalloons({ active, onDone }: { active: boolean; onDone: () => void }) {
  const group = useRef<THREE.Group>(null);
  const onDoneRef = useRef(onDone);
  const startTime = useRef(-1);
  const lanes = useMemo(() => {
    const arr = [];
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed + 1) * 10000;
      return x - Math.floor(x);
    };
    
    // Initial sparse
    for (let i = 0; i < 15; i++) {
      arr.push({
        x: -2.0 + pseudoRandom(i * 1.1) * 4.0,
        y: -3.0 - pseudoRandom(i * 2.1) * 1.5,
        dist: 1.4 + pseudoRandom(i * 3.1) * 0.2,
        scale: 2.0 + pseudoRandom(i * 4.1) * 0.5,
        speed: 1.1 + pseudoRandom(i * 5.1) * 0.5,
        drift: 0.1 + pseudoRandom(i * 6.1) * 0.2,
        rot: -Math.PI + pseudoRandom(i * 7.1) * Math.PI * 2,
        delay: pseudoRandom(i * 8.1) * 4.0,
      });
    }
    // Dense Wall (massive scale)
    for (let i = 15; i < 35; i++) {
      arr.push({
        x: -2.0 + pseudoRandom(i * 1.1) * 4.0,
        y: -3.0 - pseudoRandom(i * 2.1) * 1.5,
        dist: 1.4 + pseudoRandom(i * 3.1) * 0.2,
        scale: 2.5 + pseudoRandom(i * 4.1) * 0.7,
        speed: 1.3 + pseudoRandom(i * 5.1) * 0.4,
        drift: 0.05 + pseudoRandom(i * 6.1) * 0.1,
        rot: -Math.PI + pseudoRandom(i * 7.1) * Math.PI * 2,
        delay: 4.5 + pseudoRandom(i * 8.1) * 1.5,
      });
    }
    // Final sparse
    for (let i = 35; i < 45; i++) {
      arr.push({
        x: -2.0 + pseudoRandom(i * 1.1) * 4.0,
        y: -3.0 - pseudoRandom(i * 2.1) * 1.5,
        dist: 1.4 + pseudoRandom(i * 3.1) * 0.2,
        scale: 2.0 + pseudoRandom(i * 4.1) * 0.5,
        speed: 1.1 + pseudoRandom(i * 5.1) * 0.5,
        drift: 0.1 + pseudoRandom(i * 6.1) * 0.2,
        rot: -Math.PI + pseudoRandom(i * 7.1) * Math.PI * 2,
        delay: 6.5 + pseudoRandom(i * 8.1) * 3.5,
      });
    }
    // Giant screen-blocking balloon at the transition
    arr.push({
      x: 0,
      y: -10.0,
      dist: 0.1,
      scale: 5.0,
      speed: 4.0,
      drift: 0.0,
      rot: 0,
      delay: 4.875,
    });
    return arr;
  }, []);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!active) return;
    startTime.current = -1;
    const timer = window.setTimeout(() => onDoneRef.current(), 24000);
    return () => window.clearTimeout(timer);
  }, [active]);

  useFrame((state) => {
    if (!group.current || !active) return;
    if (startTime.current < 0) startTime.current = state.clock.elapsedTime;
    const elapsed = Math.max(0, state.clock.elapsedTime - startTime.current);
    group.current.children.forEach((child, index) => {
      const lane = lanes[index];
      if (!lane) return;
      const travel = Math.max(0, elapsed - lane.delay) * lane.speed;
      child.visible = elapsed > lane.delay;
      child.position.x = lane.x + Math.sin(travel * 1.5 + lane.drift) * 0.45;
      child.position.y = state.camera.position.y + lane.y + travel;
      child.position.z = state.camera.position.z - lane.dist;
      child.rotation.y = lane.rot + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.16;
    });
  });

  if (!active) return null;

  return (
    <group ref={group}>
      {lanes.map((lane, index) => (
        <NormalizedModel
          desiredHeight={lane.scale}
          key={index}
          position={[lane.x, lane.y, -lane.dist]}
          rotation={[0, lane.rot, 0]}
          url={MODELS.balloons}
        />
      ))}
    </group>
  );
}

export function CartoonPop({
  children,
  signal,
  position,
}: {
  children: React.ReactNode;
  signal: number;
  position: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const start = useRef(0);

  useEffect(() => {
    if (signal > 0) start.current = performance.now();
  }, [signal]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const elapsed = (performance.now() - start.current) / 1000;
    const active = signal > 0 && elapsed < 1.35;
    const wobble = active ? Math.sin(elapsed * 22) * (1 - elapsed / 1.35) : 0;
    const squash = active ? Math.sin(elapsed * 14) * (1 - elapsed / 1.35) : 0;
    group.current.scale.lerp(new THREE.Vector3(1 + squash * 0.24, 1 - squash * 0.16, 1 + squash * 0.2), delta * 14);
    group.current.rotation.z = wobble * 0.18;
    group.current.rotation.y = wobble * 0.08;
  });

  return (
    <group ref={group} position={position}>
      {children}
    </group>
  );
}

export function DreamSparkles({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const sparkles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        x: -1.35 + (index % 6) * 0.54,
        y: 0.2 + Math.floor(index / 6) * 0.34,
        z: -1.25 - (index % 3) * 0.08,
        size: 0.028 + (index % 4) * 0.011,
        phase: index * 0.47,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.visible = active;
    group.current.children.forEach((child, index) => {
      const sparkle = sparkles[index];
      const pulse = 0.6 + Math.sin(state.clock.elapsedTime * 3.2 + sparkle.phase) * 0.5;
      child.scale.setScalar(Math.max(0.2, pulse));
      child.position.y = sparkle.y + Math.sin(state.clock.elapsedTime * 0.9 + sparkle.phase) * 0.035;
    });
  });

  return (
    <group ref={group}>
      {sparkles.map((sparkle, index) => (
        <mesh key={index} position={[sparkle.x, sparkle.y, sparkle.z]}>
          <sphereGeometry args={[sparkle.size, 10, 10]} />
          <meshBasicMaterial color={index % 2 ? "#fff6b8" : "#ffffff"} transparent opacity={0.86} />
        </mesh>
      ))}
    </group>
  );
}

export function TwinkleGarland({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const bulbs = useMemo(
    () =>
      Array.from({ length: 41 }, (_, index) => ({
        x: -9.0 + index * 0.45,
        y: 1.48 + Math.sin(index * 0.7) * 0.16,
        color: ["#ff78c8", "#fff1a8", "#9be7ff", "#b78cff"][index % 4],
        phase: index * 0.55,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.visible = active;
    group.current.children.forEach((child, index) => {
      const bulb = bulbs[Math.min(index, bulbs.length - 1)];
      const pulse = 0.65 + Math.sin(state.clock.elapsedTime * 3.5 + bulb.phase) * 0.35;
      child.scale.setScalar(0.8 + pulse * 0.55);
    });
  });

  return (
    <group ref={group} position={[0, 0, -1.45]}>
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[18.5, 0.018, 0.018]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </mesh>
      {bulbs.map((bulb, index) => (
        <mesh key={index} position={[bulb.x, bulb.y, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={bulb.color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function RotatableGramophone({
  musicActive,
  onClick,
  interactive = true,
}: {
  musicActive: boolean;
  onClick: () => void;
  interactive?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const pulseGroup = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const rotation = useRef(-0.58);
  const [initialRotation] = useState(-0.58);
  
  // LƯU LẠI THỜI GIAN CLICK ĐỂ LÀM ANIMATION
  const clickTime = useRef(0);

  useEffect(() => {
    if (group.current) {
      group.current.rotation.y = initialRotation;
      rotation.current = initialRotation;
    }
  }, [initialRotation]);

  useFrame((state, delta) => {
    if (!pulseGroup.current) return;
    
    // 1. Nhịp đập của nhạc (như cũ)
    const beat = musicActive ? Math.max(0, Math.sin(state.clock.elapsedTime * 7.2)) : 0;
    
    // 2. Hiệu ứng bẹp/nảy khi click (Cartoon Squash & Stretch)
    const clickElapsed = clickTime.current > 0 ? (performance.now() - clickTime.current) / 1000 : 999;
    const activeClick = clickElapsed < 0.6; // Hoạt ảnh kéo dài 0.6s
    
    // Biên độ nảy: Xoắn ốc giảm dần theo thời gian
    const squash = activeClick ? Math.sin(clickElapsed * 20) * (1 - clickElapsed / 0.6) : 0;
    
    // Trộn nhịp nhạc với độ bẹp
    const targetScale = new THREE.Vector3(
      1 + beat * 0.08 + squash * 0.25,  // X bành ra
      1 + beat * 0.13 - squash * 0.35,  // Y lùn xuống (bẹp)
      1 - beat * 0.035 + squash * 0.25  // Z bành ra
    );
    
    // Tăng tốc độ lerp lên 15 để phản hồi nhạy bén hơn
    pulseGroup.current.scale.lerp(targetScale, delta * 15); 
    
    // Thêm chút nghiêng ngả (wobble) hai bên khi ấn
    pulseGroup.current.rotation.z = (musicActive ? Math.sin(state.clock.elapsedTime * 6.4) * 0.025 : 0) + (squash * 0.15);
  });

  return (
    <group
      ref={group}
      position={[0, 0, 0]}
      onPointerDown={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
        dragging.current = true;
        lastX.current = event.nativeEvent.clientX;
      }}
      onPointerMove={(event) => {
        if (!dragging.current || !group.current || !interactive) return;
        const deltaX = event.nativeEvent.clientX - lastX.current;
        if (Math.abs(deltaX) > 2) {
          rotation.current += deltaX * 0.012;
          lastX.current = event.nativeEvent.clientX;
          group.current.rotation.y = rotation.current;
        }
      }}
      onPointerUp={(event) => {
        if (!interactive) return;
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
        dragging.current = false;
      }}
      onClick={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        
        // KÍCH HOẠT ANIMATION BẸP KHI ẤN
        clickTime.current = performance.now();
        
        if (onClick) onClick();
      }}
    >
      <group ref={pulseGroup} position={[0, 0.38, 0]}>
        <Center disableY>
          <Model
            loop={musicActive}
            materialTone="glow"
            position={[0, -0.32, 0]}
            scale={0.64}
            url={MODELS.gramophone}
          />
        </Center>
      </group>
    </group>
  );
}

export function MusicNotes({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const notes = useMemo(
    () => [
      { text: "♪", x: -0.5, y: 0.2, z: 0, color: "#ff5fb7", speed: 0.42 },
      { text: "♫", x: -0.12, y: 0.36, z: 0.08, color: "#9b6cff", speed: 0.5 },
      { text: "♪", x: 0.22, y: 0.12, z: -0.06, color: "#ffd166", speed: 0.46 },
      { text: "♬", x: 0.55, y: 0.28, z: 0.04, color: "#5de2ff", speed: 0.54 },
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.visible = active;
    const elapsed = state.clock.elapsedTime;
    group.current.children.forEach((child, index) => {
      const note = notes[index];
      const cycle = (elapsed * note.speed + index * 0.23) % 1.9;
      child.position.y = note.y + cycle * 0.78;
      child.position.x = note.x + Math.sin(elapsed * 4.2 + index) * 0.18;
      child.rotation.z = Math.sin(elapsed * 6 + index) * 0.22;
    });
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {notes.map((note) => (
        <Text anchorX="center" anchorY="middle" color={note.color} fontSize={0.34} key={`${note.text}-${note.x}`} position={[note.x, note.y, note.z]} outlineColor="#ffffff" outlineWidth={0.018}>
          {note.text}
        </Text>
      ))}
    </group>
  );
}

export function LightBulbGlow({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!group.current) return;
    const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 2.8 + position[0] * 2) * 0.3;
    group.current.scale.setScalar(0.9 + pulse * 0.22);
    if (light.current) light.current.intensity = 3.8 + pulse * 3.2;
  });

  return (
    <group ref={group} position={position}>
      <pointLight ref={light} color="#ffd5f0" distance={5} intensity={4.8} />
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial color="#fff1aa" transparent opacity={0.86} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial color="#ff9fda" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

export function MusicCatWalk({ hideHtml, interactive, musicActive, resumeSignal, onPlayTouch, onPlayMeow, onPlayPat, onCatChanged }: { hideHtml?: boolean; interactive: boolean; musicActive: boolean; resumeSignal?: number; onPlayTouch: () => void; onPlayMeow: () => void; onPlayPat: () => void; onCatChanged?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const [changed, setChanged] = useState(false);
  const pos = useRef(new THREE.Vector3(-7.0, -0.5, -0.8)); // Bắt đầu ngoài màn hình
  const targetX = useRef(0);

  useEffect(() => {
    if (resumeSignal && resumeSignal > 0) {
      setChanged(false);
      pos.current.set(-7.0, -0.5, -0.8);
    }
  }, [resumeSignal]);

  const [patting, setPatting] = useState(false);
  const [meowVisible, setMeowVisible] = useState(false);
  const faceCameraRot = useRef(0);
  const walkTime = useRef(-Math.PI / 2); // Khởi tạo góc chuẩn
  const [delayedMusicActive, setDelayedMusicActive] = useState(false);
  const [patFrame, setPatFrame] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);

  useEffect(() => {
    if (!patting) return;
    const interval = window.setInterval(() => {
      setPatFrame(f => (f + 1) % 5);
    }, 90);
    const timeout = window.setTimeout(() => setPatting(false), 450);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [patting]);

  useEffect(() => {
    if (hearts.length > 0) {
      const timer = setTimeout(() => {
        setHearts((prev) => prev.slice(4));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hearts]);

  useEffect(() => {
    if (musicActive) {
      const timer = window.setTimeout(() => setDelayedMusicActive(true), 2000);
      return () => window.clearTimeout(timer);
    } else {
      setDelayedMusicActive(false);
    }
  }, [musicActive]);

  useEffect(() => {
    if (!delayedMusicActive && !changed) return;
    let timeout: number;
    let hideTimeout: number;
    function scheduleMeow() {
      timeout = window.setTimeout(() => {
        onPlayMeow();
        setMeowVisible(true);
        hideTimeout = window.setTimeout(() => setMeowVisible(false), 1500);
        scheduleMeow();
      }, 4000 + Math.random() * 8000);
    }
    scheduleMeow();
    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, [delayedMusicActive, changed, onPlayMeow]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.visible = true;

    if (changed) {
      // Khi ấn nựng mèo: Lướt mượt về cạnh máy hát
      pos.current.lerp(new THREE.Vector3(targetX.current, -0.5, -0.6), delta * 4.0);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, faceCameraRot.current, delta * 6.0);
    } else if (delayedMusicActive) {
      // NỐI TOÁN HỌC MƯỢT MÀ: Đi thẳng từ -7.0 vào -4.5, tới đúng -4.5 thì chạy hàm Sin
      if (pos.current.x < -4.5) {
        pos.current.x += delta * 2.0;
        group.current.rotation.y = 0; 
      } else {
        walkTime.current += delta * 0.4;
        pos.current.x = Math.sin(walkTime.current) * 4.5;
        pos.current.y = -0.5; // đứng trên sàn
        pos.current.z = -0.8; 
        const vel = Math.cos(walkTime.current);
        const targetRotation = vel > 0 ? 0 : Math.PI;
        group.current.rotation.y += (targetRotation - group.current.rotation.y) * 0.1;
      }
    } else {
      pos.current.set(-7.0, -0.5, -0.8);
    }

    group.current.position.copy(pos.current);
  });

  const catScaleY = patting ? [1.0, 0.9, 0.7, 0.8, 0.95][patFrame] : 1.0;
  const catScaleXZ = patting ? [1.0, 1.05, 1.2, 1.1, 1.02][patFrame] : 1.0;
  const offsetY = -0.22 * (1 - catScaleY);
  const handOffsetY = [0, -0.04, -0.10, -0.06, -0.02][patFrame];

  return (
    <group
      ref={group}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (!interactive || !changed) return;
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
        dragging.current = true;
        lastX.current = event.nativeEvent.clientX;
      }}
      onPointerMove={(event) => {
        if (!dragging.current || !group.current || !interactive || !changed) return;
        faceCameraRot.current += (event.nativeEvent.clientX - lastX.current) * 0.012;
        lastX.current = event.nativeEvent.clientX;
      }}
      onPointerUp={(event) => {
        if (!interactive || !changed) return;
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
        dragging.current = false;
      }}
      onClick={(event) => {
        event.stopPropagation(); 
        if (!interactive) return;

        // BẢO VỆ: Lấy tọa độ chuột hiện tại (tính bằng Pixel màn hình)
        const screenX = event.nativeEvent.clientX;
        const screenY = event.nativeEvent.clientY;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // BẢO VỆ: Nếu con chuột nằm sát rìa trái/phải (cách viền 15% chiều rộng) 
        // Hoặc quá sát mép trên/dưới, thì BỎ QUA cú click. Ép người dùng phải click vào khu vực an toàn (giữa màn hình).
        if (
          screenX < screenWidth * 0.15 || 
          screenX > screenWidth * 0.85 ||
          screenY < screenHeight * 0.1 ||
          screenY > screenHeight * 0.9
        ) {
           return; 
        }

        if (!changed) {
          setChanged(true);
          onCatChanged?.();
          faceCameraRot.current = group.current ? group.current.rotation.y : 0;
          targetX.current = pos.current.x; // Chốt vị trí đứng lại
        } else {
          setPatting(true);
          onPlayPat();
          const newHearts = Array.from({ length: 4 }).map((_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 0.4,
            y: 0.6 + Math.random() * 0.3,
            scale: 0.6 + Math.random() * 0.8,
          }));
          setHearts((prev) => [...prev, ...newHearts]);
        }
      }}
    >
      {changed ? (
        <group position={[0, offsetY, 0]} scale={[catScaleXZ, catScaleY, catScaleXZ]}>
          <NormalizedModel desiredHeight={1.05} fit="max" position={[0, 0.1, 0]} url={MODELS.cat} loop materialTone="glow" noClone />
        </group>
      ) : (
        <NormalizedModel desiredHeight={1.35} fit="max" position={[0, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} url={MODELS.catWalk} loop materialTone="glow" noClone />
      )}

      {changed && patting && (
        <Html center position={[0, 0.55 + handOffsetY, 0.15]} zIndexRange={[85, 75]}>
          <div style={{ width: '56px', height: '56px', overflow: 'hidden', position: 'relative', pointerEvents: 'none' }}>
            <img src="/birthday-1/models/patpat.png" alt="pat" style={{ position: 'absolute', top: 0, left: `-${patFrame * 100}%`, width: '500%', height: '100%', maxWidth: 'none' }} />
          </div>
        </Html>
      )}

      {changed && hearts.map((heart) => (
        <Html key={heart.id} center position={[heart.x, heart.y, 0.1]} zIndexRange={[80, 70]}>
          <motion.div initial={{ y: 0, opacity: 1, scale: 0.5 }} animate={{ y: -50, opacity: 0, scale: heart.scale, rotate: [-10, 10, -5] }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-pink-400 text-2xl pointer-events-none select-none">
            💖
          </motion.div>
        </Html>
      ))}
    </group>
  );
}

function BurstParticles({ castStartedAt }: { castStartedAt: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const elapsed = castStartedAt > 0 ? (performance.now() - castStartedAt) / 1000 : 0;
    const active = castStartedAt > 0 && elapsed > 0.65 && elapsed < 1.25;
    group.current.visible = active;
    if (active) {
      const time = elapsed - 0.65;
      const t = Math.max(0, Math.min(1, time / 0.6));
      group.current.scale.setScalar(0.2 + Math.pow(t, 0.4) * 2.2);
      group.current.children.forEach((child, i) => {
        child.rotation.z = time * 3 + i;
        (child as any).material.opacity = 1 - Math.pow(t, 1.5);
      });
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={index} position={[0, 0, 0.05]}>
          <planeGeometry args={[0.2, 1.6]} />
          <meshBasicMaterial color="#fff3a1" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function MagicDust({ burst }: { burst: boolean }) {
  const group = useRef<THREE.Group>(null);
  const dust = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        angle: (index / 18) * Math.PI * 2,
        radius: 0.18 + (index % 5) * 0.08,
        y: -0.72 + (index % 6) * 0.12,
        size: 0.018 + (index % 4) * 0.01,
        color: ["#fff5a8", "#ff8fd1", "#b78cff", "#ffffff"][index % 4],
        phase: index * 0.47,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      const dot = dust[index];
      const t = state.clock.elapsedTime * (burst ? 3.5 : 1.35) + dot.phase;
      const radius = dot.radius + (burst ? 0.22 : 0) + Math.sin(t) * 0.04;
      child.position.set(Math.cos(t) * radius, dot.y + ((state.clock.elapsedTime * 0.36 + index * 0.045) % 1.25), Math.sin(t) * radius);
      child.scale.setScalar((burst ? 1.4 : 1) * (0.75 + Math.sin(t * 1.7) * 0.24));
    });
  });

  return (
    <group ref={group}>
      {dust.map((dot, index) => (
        <mesh key={index}>
          <sphereGeometry args={[dot.size, 12, 12]} />
          <meshBasicMaterial color={dot.color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function MagicDecorWand({ onDone, onMagic, onTouch, autoPlay }: { onDone: () => void; onMagic: () => void; onTouch: () => void; autoPlay?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [cast, setCast] = useState(false);
  const [castStartTime, setCastStartTime] = useState(0);
  const mountedAt = useRef(0);
  
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);
  
  // SỬA: Đổi 0.45 thành 0.75 để khớp với Y mặc định
  const basePos = useRef(new THREE.Vector3(0, 0.75, 1.42));
  const baseRot = useRef({ y: -0.38, z: -0.08 });

  useFrame((_, delta) => {
    if (!group.current) return;
    const now = performance.now();
    const entryElapsed = (now - mountedAt.current) / 1000;
    const castElapsed = cast ? (now - castStartTime) / 1000 : 0;
    const flyAway = cast && castElapsed > 1.35;
    
    let targetX = 0;
    let targetY = 0.75;
    let targetZ = 1.42;
    let targetRotY = -0.38;
    let targetRotZ = -0.08;

    if (entryElapsed < 1.5) {
      const t = Math.min(1, entryElapsed / 1.5);
      const eased = 1 - Math.pow(1 - t, 3);
      targetX = -2.4 + 2.4 * eased;
      // SỬA LỖI GIẬT MÀN CHÀO SÂN: -3 + 3.75 khớp đúng với điểm 0.75
      targetY = -3 + 3.75 * eased; 
      targetRotZ = -1.2 + 1.12 * eased;
    } else if (flyAway) {
      const t = Math.min(1, (castElapsed - 1.35) / 1.1);
      const eased = t * t * t;
      targetX = 0 + 4 * eased;
      // SỬA LỖI GIẬT XUỐNG KHI BAY: Điểm xuất phát giờ là 0.75 chứ không phải 0.45
      targetY = 0.75 + Math.sin(eased * Math.PI) * 0.6 + 2 * eased; 
      targetZ = 1.42 - 3 * eased;
      targetRotZ = -0.08 - 1.2 * eased;
      targetRotY = -0.38 + 0.8 * eased;
    }

    let flickRotZ = 0;
    let flickY = 0;
    if (cast && !flyAway) {
      if (castElapsed < 0.3) {
        const phase = castElapsed / 0.3;
        flickRotZ = Math.sin(phase * Math.PI / 2) * 0.4;
        flickY = Math.sin(phase * Math.PI / 2) * 0.15;
      } else if (castElapsed < 0.5) {
        flickRotZ = 0.4;
        flickY = 0.15;
      } else if (castElapsed < 0.65) {
        const phase = (castElapsed - 0.5) / 0.15;
        flickRotZ = 0.4 - Math.sin(phase * Math.PI / 2) * 0.8;
        flickY = 0.15 - Math.sin(phase * Math.PI / 2) * 0.3;
      } else if (castElapsed < 1.0) {
        const phase = (castElapsed - 0.65) / 0.35;
        flickRotZ = -0.4 + Math.sin(phase * Math.PI / 2) * 0.45;
        flickY = -0.15 + Math.sin(phase * Math.PI / 2) * 0.18;
      } else {
        const phase = Math.min(1, (castElapsed - 1.0) / 0.35);
        flickRotZ = 0.05 * (1 - phase);
        flickY = 0.03 * (1 - phase);
      }
    }

    if (entryElapsed < 1.5 || flyAway) {
      basePos.current.set(targetX, targetY, targetZ);
      baseRot.current.y = targetRotY;
      baseRot.current.z = targetRotZ;
    } else {
      basePos.current.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 5);
      baseRot.current.y = THREE.MathUtils.lerp(baseRot.current.y, targetRotY, delta * 12);
      baseRot.current.z = THREE.MathUtils.lerp(baseRot.current.z, targetRotZ, delta * 12);
    }

    group.current.position.copy(basePos.current);
    group.current.position.y += flickY;
    group.current.rotation.y = baseRot.current.y;
    group.current.rotation.z = baseRot.current.z + flickRotZ;
  });

  function castSpell() {
    const entryElapsed = (performance.now() - mountedAt.current) / 1000;
    if (entryElapsed < 1.5) return;
    if (cast) return;
    onTouch();
    setCast(true);
    setCastStartTime(performance.now());
    window.setTimeout(onMagic, 1350);
    window.setTimeout(onDone, 2450);
  }

  useEffect(() => {
    if (autoPlay && !cast) {
      const timer = setTimeout(() => {
        castSpell();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, cast]);

  return (
    <group ref={group} position={[-2.4, -3, 1.42]}>
      <MagicDust burst={cast} />
      <group onClick={(event) => { event.stopPropagation(); castSpell(); }}>
        <BurstParticles castStartedAt={cast ? castStartTime : 0} />
        <mesh position={[0.1, 0.08, 0.08]}>
          <boxGeometry args={[0.8, 0.8, 0.36]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.001} />
        </mesh>
        <NormalizedModel desiredHeight={0.7} fit="max" position={[0, 0, 0]} rotation={[0, -0.38, -0.2]} url={MODELS.magicWand} />
        <pointLight color="#fff1a8" distance={4} intensity={cast ? 9 : 0} position={[0.62, -0.22, 0.28]} />
      </group>
      <Html center position={[0.2, -0.05, 0.05]} zIndexRange={[80, 70]}>
        <motion.div
          animate={{ opacity: cast ? 0 : 1, rotate: [-2, 2, -2], scale: [1, 1.04, 1] }}
          className="pointer-events-none whitespace-nowrap rounded-none bg-transparent px-2 text-center text-lg font-black leading-tight drop-shadow-[0_3px_0_rgba(91,35,85,0.22)]"
          style={{ color: '#ffd84d' }}
          transition={{ duration: 1.3, repeat: cast ? 0 : Infinity }}
        >
          Hãy<br />trang trí!!
        </motion.div>
      </Html>
    </group>
  );
}

function NumberCandle({ age = 20, position = [0, 0, 0], scale = 1, lit = false }: { age?: number, position?: [number, number, number], scale?: number, lit?: boolean }) {
  const ageStr = age.toString().padStart(2, "0");
  return (
    <group position={position} scale={scale}>
      {ageStr.split("").map((char, i) => (
        <group key={i} position={[(i - 0.5) * 0.55, 0, 0]}>
          <Text3D
            font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json"
            size={0.35} height={0.1} curveSegments={12}
            bevelEnabled bevelThickness={0.02} bevelSize={0.015}
            position={[-0.15, 0, 0]}
          >
            {char}
            <meshStandardMaterial color={i === 0 ? "#ff6b9d" : "#6bb5ff"} roughness={0.4} emissive={i === 0 ? "#ff6b9d" : "#6bb5ff"} emissiveIntensity={0.2} />
          </Text3D>
          <mesh position={[0, 0.4, 0.05]}>
            <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {lit && <AnimatedFire position={[0, 0.48, 0.05]} scale={0.25} />}
        </group>
      ))}
    </group>
  );
}

export function CakeSet({ candleLit, rotating, age }: { candleLit?: boolean; rotating?: boolean; age: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current && rotating) group.current.rotation.y += delta * 0.45;
  });

  // Cake is ~2.85 units tall, center at y=0, bottom at y=-1.425, top at y=+1.425
  // 2nd tier top is approximately at y=0.8 (estimate for strawberry cake)
  const cakeTierTop = 0.72;

  return (
    <group ref={group}>
      {/* Cake model centered at y=0 */}
      <NormalizedModel desiredHeight={2.85} position={[0, 0, 0]} url={MODELS.cake} />
      {/* Main candle placed on top of cake */}
      <group position={[0, cakeTierTop + 0.28, 0]}>
        <Model scale={0.9} url={MODELS.candle} />
        {candleLit && (
          <group position={[0, 0.55, 0]}>
            <AnimatedFire lockRotation scale={0.7} />
            <pointLight color="#ffbd6f" distance={3} intensity={5} position={[0, 0.1, 0]} />
          </group>
        )}
      </group>
      {/* Age number candles ON TOP of 2nd tier, centered */}
      <NumberCandle age={age} lit={candleLit} position={[0, cakeTierTop + 0.42, 0]} scale={1.0} />
      {/* Extra glow lights around cake base */}
      <pointLight color="#ff88ce" distance={4} intensity={3} position={[0.8, -0.5, 0.8]} />
      <pointLight color="#88ceff" distance={4} intensity={3} position={[-0.8, -0.5, -0.8]} />
      <pointLight color="#ffce88" distance={4} intensity={3} position={[0.8, -0.5, -0.8]} />
      <pointLight color="#ce88ff" distance={4} intensity={3} position={[-0.8, -0.5, 0.8]} />
    </group>
  );
}

export function CakeOnly() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={group}>
      <NormalizedModel desiredHeight={2.85} position={[0, 0, 0]} url={MODELS.cake} />
    </group>
  );
}

let globalCakeRotation = 0;

export function RotatableCake() {
  const group = useRef<THREE.Group>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = globalCakeRotation;
    }
  });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging.current || !group.current) return;
      globalCakeRotation += (event.clientX - lastX.current) * 0.012;
      lastX.current = event.clientX;
    };

    const stopDragging = () => {
      dragging.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, []);

  return (
    <group
      ref={group}
      onPointerDown={(event) => {
        event.stopPropagation();
        dragging.current = true;
        lastX.current = event.nativeEvent.clientX;
      }}
    >
      <CakeOnly />
    </group>
  );
}

function MatchstickModel({ ...props }: ThreeElements["group"]) {
  return (
    <group {...props}>
      {/* Hạ Y xuống 0.005 và nhích X sang -0.135 để ngọn lửa nuốt trọn hoàn toàn đầu đỏ */}
      <NormalizedModel 
        desiredHeight={0.35} 
        fit="max" 
        position={[-0.135, 0.005, 0]} 
        rotation={[0, 0, Math.PI - 0.2]} 
        url={MODELS.matchstick} 
      />
    </group>
  );
}

function MatchboxModel({ ...props }: ThreeElements["group"]) {
  return (
    <group {...props}>
      {/* Giảm scale từ 1.5 xuống 0.5 để hộp diêm gọn gàng */}
      <NormalizedModel desiredHeight={0.5} fit="max" position={[0, 0, 0]} rotation={[0.1, 1.4, 0]} url={MODELS.matchbox} />
    </group>
  );
}

function AnimatedFire({ scale = 1, lockRotation = false, ...props }: { scale?: number; lockRotation?: boolean } & ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Group>(null);
  const worldQuat = useMemo(() => new THREE.Quaternion(), []);
  const [sparks] = useState(() => Array.from({ length: 8 }, (_, i) => ({
    x: (Math.random() - 0.5) * 0.15,
    y: Math.random() * 0.4,
    z: (Math.random() - 0.5) * 0.15,
    speed: 0.8 + Math.random() * 1.5,
  })));

  useFrame((state, delta) => {
    if (group.current) {
      const parent = group.current.parent;
      if (parent && !lockRotation) {
        parent.getWorldQuaternion(worldQuat);
        group.current.quaternion.copy(worldQuat).invert();
      } else if (lockRotation) {
        group.current.quaternion.identity();
      }
      const t = state.clock.elapsedTime * 14;
      group.current.scale.setScalar(scale * (1 + Math.sin(t) * 0.06));
      group.current.rotateX(Math.sin(t * 0.8) * 0.08);
      group.current.rotateZ(Math.cos(t * 0.9) * 0.08);
    }
    if (sparksRef.current) {
      const parent = sparksRef.current.parent;
      if (parent && !lockRotation) {
        parent.getWorldQuaternion(worldQuat);
        sparksRef.current.quaternion.copy(worldQuat).invert();
      } else if (lockRotation) {
        sparksRef.current.quaternion.identity();
      }
      sparksRef.current.children.forEach((child, i) => {
        const data = sparks[i];
        data.y += delta * data.speed;
        if (data.y > 0.6) {
          data.y = 0;
          data.x = (Math.random() - 0.5) * 0.15;
          data.z = (Math.random() - 0.5) * 0.15;
        }
        child.position.set(data.x * scale, data.y * scale, data.z * scale);
        child.scale.setScalar(Math.max(0, 1 - data.y / 0.6) * scale);
      });
    }
  });

  return (
    <group {...props}>
      <group ref={group}>
        <NormalizedModel loop desiredHeight={1} fit="max" materialTone="fire" url={MODELS.fire} />
      </group>
      <group ref={sparksRef}>
        {sparks.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#ffcc00" : "#ff6600"} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}


function BoxMagicDust() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Tạo tọa độ và quỹ đạo bay ngẫu nhiên, độc lập cho từng hạt sáng
  const particles = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
     angle: (i / 8) * Math.PI * 2,
     speed: 0.8 + Math.random() * 0.5,
     radius: 0.15 + Math.random() * 0.1
  })), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Mỗi hạt bay lượn một kiểu khác nhau, không bị "cứng ngắt" như bánh xe nữa
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.x = Math.cos(p.angle + t * p.speed) * p.radius;
      child.position.y = Math.sin(p.angle + t * p.speed * 0.8) * p.radius + Math.sin(t * 2 + i) * 0.05;
      child.position.z = Math.sin(t * p.speed) * 0.1;
      
      // Hiệu ứng chớp tắt lung linh
      const scale = 0.5 + Math.sin(t * 5 + i) * 0.5;
      child.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#ff9fda" : "#fff1a8"} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function MatchMagicDust() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Tạo 12 hạt đốm sáng với tốc độ, quỹ đạo và góc bay hoàn toàn ngẫu nhiên
  const sparks = useMemo(() => Array.from({ length: 12 }, () => ({
    x: (Math.random() - 0.5) * 0.1,
    y: (Math.random() - 0.5) * 0.1,
    speed: 3 + Math.random() * 3,
    angle: Math.random() * Math.PI * 2,
    scale: 0.5 + Math.random() * 0.5
  })), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Thuật toán cho các hạt bay lượn hỗn loạn như đom đóm
    groupRef.current.children.forEach((child, i) => {
      const spark = sparks[i];
      child.position.x = Math.sin(t * spark.speed + spark.angle) * 0.05 + spark.x;
      child.position.y = Math.cos(t * spark.speed + spark.angle) * 0.05 + spark.y;
      child.scale.setScalar(spark.scale * (0.5 + Math.sin(t * 8 + i) * 0.5));
    });
  });

  return (
    <group ref={groupRef}>
      {sparks.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#ffcc00" : "#ffb8e8"} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function CandleSequence({ phase, age, onCandleLit, onWishRecorded, recipientName, onGiftOpen, celebrationZoom, autoPlay, instructionText, wishPromptText, recordingText, giftPromptText, bannerTitle, bannerName }: { phase: BirthdayPhase; age: number; onCandleLit: () => void; onWishRecorded: (audioUrl: string) => void; recipientName?: string; onGiftOpen?: () => void; celebrationZoom?: boolean; autoPlay?: boolean; instructionText?: string; wishPromptText?: string; recordingText?: string; giftPromptText?: string; bannerTitle?: string; bannerName?: string; }) {
  const [holding, setHolding] = useState(false); const [nearWick, setNearWick] = useState(false);
  const [lit, setLit] = useState(false); const [matchLit, setMatchLit] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0); const [wishTimeLeft, setWishTimeLeft] = useState(10);
  const [showHelper, setShowHelper] = useState(false);
  const autoPlayStart = useRef(performance.now());

  const litProgressRef = useRef(0); const fireScaleRef = useRef(0);
  const candleFireRef = useRef<THREE.Group>(null);
  const candleGroup = useRef<THREE.Group>(null);
  const mainCandleRef = useRef<THREE.Group>(null);
  
  const strikeTime = useRef(0); const lastMatchX = useRef(0);
  const sparkGroup = useRef<THREE.Group>(null); const matchFireRef = useRef<THREE.Group>(null);
  const matchFireScaleRef = useRef(0); const flickStartTime = useRef(0);
  const matchboxWrap = useRef<THREE.Group>(null);
  const matchGroup = useRef<THREE.Group>(null);
  const tipPos = useMemo(() => new THREE.Vector3(), []);
  
  useEffect(() => {
    if (phase === "wish-record") {
      setWishTimeLeft(10);
      if (autoPlay) {
        const timer = setInterval(() => {
          setWishTimeLeft((prev) => {
            if (prev <= 1) { clearInterval(timer); stopRecordingAndBlow(); return 0; }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }
    if (phase === "match-ignite") {
      autoPlayStart.current = performance.now();
    }
  }, [phase]);
  const MATCHBOX_WORLD_POS = new THREE.Vector3(-0.35, 1.15, 1.1);
  const matchWorld = useRef(new THREE.Vector3(0.25, 1.15, 1.3)); 

  const audioContextRef = useRef<AudioContext | null>(null); const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null); const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => { const helperTimer = setTimeout(() => setShowHelper(true), 1000); return () => clearTimeout(helperTimer); }, []);

  const startRecording = async () => {
    if (recorderRef.current && recorderRef.current.state === "recording") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
      
      // Prevent recording if user released button during permission prompt
      if (!isPressingRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser(); const source = audioCtx.createMediaStreamSource(stream); source.connect(analyser); analyser.fftSize = 256;
      chunksRef.current = []; const recorder = new MediaRecorder(stream); recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = () => { const blob = new Blob(chunksRef.current, { type: "audio/webm" }); const reader = new FileReader(); reader.onloadend = () => { onWishRecorded(String(reader.result)); }; reader.readAsDataURL(blob); };
      recorder.start(); setIsRecording(true);
      const checkVolume = () => {
        if (!recorder || recorder.state !== "recording") return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(dataArray);
        let sum = 0; for (let i = 0; i < analyser.frequencyBinCount; i++) sum += dataArray[i];
        const avg = sum / analyser.frequencyBinCount;
        const waveBar = document.getElementById("record-wave-indicator"); if (waveBar) waveBar.style.height = `${Math.min(100, Math.max(10, avg * 1.2))}px`;
        // Animate 5-bar wave
        [0,1,2,3,4].forEach((i) => {
          const bar = document.getElementById(`record-wave-bar-${i}`);
          if (bar) {
            const offset = Math.sin(Date.now() / 150 + i * 0.8) * 0.5 + 0.5;
            bar.style.height = `${Math.min(48, Math.max(8, avg * 0.8 * offset + 8))}px`;
          }
        });
        requestAnimationFrame(checkVolume);
      }; checkVolume();
    } catch (err) { 
      setIsRecording(false);
      // Advance if mic permission denied, to prevent getting stuck
      onWishRecorded("");
    }
  };

  const isPressingRef = useRef(false);

  const handlePressStart = (e: React.PointerEvent) => {
    e.preventDefault();
    if (autoPlay) return;
    try { (e.target as HTMLElement).setPointerCapture(e.pointerId); } catch(err) {}
    setIsPressing(true);
    isPressingRef.current = true;
    // Use timeout to let state update, then check
    setTimeout(() => startRecording(), 0);
  };
  
  const handlePressEnd = (e: React.PointerEvent) => {
    e.preventDefault();
    if (autoPlay) return;
    try { 
      if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch(err) {}
    setIsPressing(false);
    isPressingRef.current = false;
    stopRecordingAndBlow();
  };

  const stopRecordingAndBlow = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    } else {
      // Clean up stream if recorder wasn't started yet
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop()); 
      if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close(); 
      setIsRecording(false);
      // User released before recording started (e.g., just tapped for permission)
      // Do NOT advance here. Wait for a real recording or a permission denial.
      return;
    }
    
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop()); 
    if (audioContextRef.current && audioContextRef.current.state !== "closed") audioContextRef.current.close(); 
    setIsRecording(false);
  };

  useFrame((state, delta) => {
    let targetRotZ = 0; let targetRotX = 0; let isFlicking = false; let flyT = 0;
    if (lit && flickStartTime.current > 0) {
      const elapsed = performance.now() - flickStartTime.current;
      if (elapsed < 800) { isFlicking = true; targetRotZ = matchWorld.current.x < 0 ? -0.4 : 0.4; targetRotX = Math.sin(elapsed/1000 * 15) * 0.6; } 
      else { flickStartTime.current = -performance.now(); setHolding(false); }
    } else if (lit && flickStartTime.current < 0) flyT = (performance.now() - (-flickStartTime.current)) / 1000;

    if (!isFlicking) {
      if (!matchLit && holding && phase === "match-ignite") {
        if (Math.abs(MATCHBOX_WORLD_POS.y - matchWorld.current.y) < 0.6 && Math.abs(MATCHBOX_WORLD_POS.x - matchWorld.current.x) < 1.0) {
          targetRotZ = 0.8;
          const velocityX = Math.abs(matchWorld.current.x - lastMatchX.current);
          if (velocityX > 0.03 && performance.now() - strikeTime.current > 200) {
            strikeTime.current = performance.now(); setStrikeCount((c) => { const next = c + 1; if (next >= 3) setMatchLit(true); return next; });
          }
        } else targetRotZ = matchWorld.current.x < 0 ? -0.4 : 0.4;
      } else if (holding || nearWick) targetRotZ = matchWorld.current.x < 0 ? -0.4 : 0.4;
    }
    lastMatchX.current = matchWorld.current.x;

    if (matchGroup.current) {
      if (!holding && !isFlicking) {
        if (lit && flickStartTime.current < 0) {
          matchWorld.current.x = THREE.MathUtils.lerp(matchWorld.current.x, 5.0, delta * 3);
          matchWorld.current.y = THREE.MathUtils.lerp(matchWorld.current.y, -3.0, delta * 3); targetRotZ += delta * 4;
        } else matchWorld.current.lerp(new THREE.Vector3(0.25, 1.15 + Math.sin(state.clock.elapsedTime * 2.5) * 0.02, 1.3), delta * 4);
      }
      matchGroup.current.position.lerp(matchWorld.current, delta * 18);
      matchGroup.current.rotation.z = THREE.MathUtils.lerp(matchGroup.current.rotation.z, targetRotZ, delta * 10);
      matchGroup.current.rotation.x = THREE.MathUtils.lerp(matchGroup.current.rotation.x, targetRotX, delta * 10);
    }

    if (sparkGroup.current) {
      const sparkAge = performance.now() - strikeTime.current;
      if (sparkAge < 500 && strikeCount > 0 && !matchLit) { sparkGroup.current.scale.setScalar(1 - Math.pow(sparkAge / 500, 2)); sparkGroup.current.visible = true; } 
      else sparkGroup.current.visible = false;
    }

    if (matchboxWrap.current && lit && flickStartTime.current < 0) {
      matchboxWrap.current.position.x = THREE.MathUtils.lerp(matchboxWrap.current.position.x, -5.0, delta * 3);
      matchboxWrap.current.position.y = THREE.MathUtils.lerp(matchboxWrap.current.position.y, -3.0, delta * 3);
      matchboxWrap.current.rotation.z -= delta * 4;
    }

    if (matchFireRef.current) {
      matchFireRef.current.scale.setScalar(Math.max(0.001, 0.45 * (matchLit && !isFlicking && !lit ? (matchFireScaleRef.current = Math.min(1, matchFireScaleRef.current + delta * 3.5)) : (matchFireScaleRef.current = Math.max(0, matchFireScaleRef.current - delta * 5.0)))));
      matchFireRef.current.getWorldPosition(tipPos);
      const wickY = mainCandleRef.current ? mainCandleRef.current.position.y - 2.35 + 0.7 * mainCandleRef.current.scale.y : 1.33;
      setNearWick(Math.hypot(tipPos.x, tipPos.y - wickY) < 0.35);
    }
    
    if (mainCandleRef.current) {
      const targetY = (phase === "match-ignite" || phase === "wish-record") ? 2.7 : 2.6;
      mainCandleRef.current.position.y = THREE.MathUtils.lerp(mainCandleRef.current.position.y, targetY, delta * 2.0);
      
      const targetScale = (phase === "match-ignite" || phase === "wish-record") ? 1.4 : 1.0;
      const curScale = mainCandleRef.current.scale.x;
      mainCandleRef.current.scale.setScalar(THREE.MathUtils.lerp(curScale, targetScale, delta * 2.0));
    }
    
    fireScaleRef.current = lit ? Math.min(1, fireScaleRef.current + delta / 2.0) : Math.max(0, fireScaleRef.current - delta * 3.0);
    if (candleFireRef.current) candleFireRef.current.scale.setScalar(Math.max(0.001, fireScaleRef.current * 0.8));
    
    if (holding && matchLit && nearWick && phase === "match-ignite" && !lit) {
        litProgressRef.current = Math.min(1, litProgressRef.current + delta / 1.5); 
        if (litProgressRef.current >= 1) { 
          setLit(true); 
          flickStartTime.current = performance.now(); 
          onCandleLit(); 
        }
    } else {
      litProgressRef.current = Math.max(0, litProgressRef.current - delta);
    }

    if (phase === "celebration" && candleGroup.current && !celebrationZoom) {
      candleGroup.current.rotation.y += delta * 0.3;
    }

    if (autoPlay && phase === "match-ignite" && !lit) {
      const elapsed = (performance.now() - autoPlayStart.current) / 1000;
      
      const activeElapsed = elapsed - 9.0; // Wait 9s for balloons to clear!
      
      if (activeElapsed > 0) {
        setHolding(true);
        if (activeElapsed < 1.0) {
           matchWorld.current.lerp(new THREE.Vector3(-0.25, 1.15, 1.3), delta * 5);
        } else if (activeElapsed < 2.2 && !matchLit) {
           matchWorld.current.x = -0.3 + Math.sin(activeElapsed * 35) * 0.15;
           matchWorld.current.y = 1.15 + Math.cos(activeElapsed * 25) * 0.05;
           if (activeElapsed > 2.0 && strikeCount < 3) {
              setStrikeCount(3);
              setMatchLit(true);
           }
        } else if (matchLit) {
           const wickY = mainCandleRef.current ? mainCandleRef.current.position.y - 2.35 + 0.7 * mainCandleRef.current.scale.y : 1.33;
           matchWorld.current.lerp(new THREE.Vector3(0.0, wickY - 0.05, 1.3), delta * 4);
        }
      }
    }
  });

  useEffect(() => {
    if (!autoPlay) return;
    if (phase === "wish-record") {
      const timer = setTimeout(() => {
        stopRecordingAndBlow();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, phase, lit]);

  return (
    <>
      <ambientLight color="#000000" intensity={0} />

      <group ref={matchboxWrap} position={[-0.35, 1.15, 1.1]} visible={phase === "match-ignite"}>
        <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.3}><MatchboxModel scale={1.0} /></Float>
      </group>

      <group visible={phase === "match-ignite" || phase === "wish-record" || phase === "celebration" || phase === "gift-reveal"}>
        <group ref={candleGroup} position={[0, -2.35, 0]}>
          
          <group ref={mainCandleRef} position={[0, 3.8, 0]}>
            <NormalizedModel desiredHeight={1.4} url={MODELS.candle} />
            <group ref={candleFireRef} position={[0, 0.7, 0]} scale={0.001}><AnimatedFire lockRotation scale={0.5} /></group>
            {/* GIỚI HẠN BÁN KÍNH SÁNG ĐỂ TẠO VÒNG TRÒN LỬA TRONG BÓNG ĐÊM */}
            {lit && <pointLight color="#ffbd6f" distance={1.8} decay={2} intensity={5} position={[0, 0.7, 0.1]} />}
          </group>

          {phase !== "match-ignite" && phase !== "wish-record" && (
            <group>
              <group scale={0.7} position={[0, 5.0, 0]}>
                <BirthdayBanner name={bannerName || recipientName || ""} title={bannerTitle} visible={phase === "celebration"} position={[0, 0, 0]} />
              </group>
              <NormalizedModel desiredHeight={2.85} position={[0, 1.425, 0]} url={MODELS.cake} />
              <NumberCandle age={age} lit={lit} position={[0, 2.22, 0.4]} scale={0.9} />
              <CelebrationEffects />
            </group>
          )}

        </group>

        {phase !== "match-ignite" && phase !== "wish-record" && (
          <group position={[0, -2.35, 0]}>
            <NormalizedModel position={[-2.2, 0.5, 0.8]} desiredHeight={1.0} url={MODELS.giftBox} />
            <NormalizedModel position={[2.2, 0.4, -0.5]} desiredHeight={0.8} url={MODELS.giftBox} />
            <GiftFinale onOpen={onGiftOpen || (() => {})} opening={phase === "gift-reveal"} position={[1.6, 0.6, 1.4]} celebrationZoom={celebrationZoom} autoPlay={autoPlay} giftPromptText={giftPromptText} />
          </group>
        )}
      </group>

      {phase === "match-ignite" && !lit && (
        <mesh position={[0, 1.2, 1.35]} onPointerDown={(e) => { 
            if (!autoPlay) {
              // Manual mode: immediate interaction
              e.stopPropagation(); setHolding(true); matchWorld.current.copy(e.point);
            } else {
              const elapsed = (performance.now() - autoPlayStart.current) / 1000;
              if (elapsed < 3.0) return;
              e.stopPropagation(); setHolding(true); matchWorld.current.copy(e.point);
            }
          }} onPointerMove={(e) => { 
            if (!holding) return; 
            if (!autoPlay) {
              // Manual mode: follow mouse immediately
              e.stopPropagation(); matchWorld.current.copy(e.point);
            } else {
              const elapsed = (performance.now() - autoPlayStart.current) / 1000;
              if (elapsed < 9.0) return;
              e.stopPropagation(); matchWorld.current.copy(e.point);
            }
          }} onPointerUp={() => setHolding(false)}>
          <planeGeometry args={[100, 100]} /><meshBasicMaterial visible={false} />
        </mesh>
      )}

      <group ref={matchGroup} position={[0.6, 1.2, 1.35]} visible={phase === "match-ignite"}>
        <MatchstickModel scale={1.0} position={[0, 0, 0]} />
        <group ref={matchFireRef} position={[-0.26, 0.06, 0]} scale={0.001}><AnimatedFire scale={0.3} /></group>
        {/* LỬA DIÊM CŨNG BỊ GIỚI HẠN BÁN KÍNH (1.0) ĐỂ KHÔNG SÁNG ĐẾN ĐÁY CÂY NẾN */}
        {matchLit && (<pointLight color="#ffbd6f" distance={1.0} decay={2} intensity={nearWick ? 8.0 : 4.0} position={[-0.26, 0.06, 0]} />)}

        <group ref={sparkGroup} position={[-0.26, 0.06, 0]} visible={false}>
          <mesh position={[0.05, 0, 0]}><sphereGeometry args={[0.04]}/><meshBasicMaterial color="#ffcc00"/></mesh>
          <mesh position={[-0.05, 0.05, 0]}><sphereGeometry args={[0.03]}/><meshBasicMaterial color="#ffaa00"/></mesh>
          <pointLight color="#ffcc00" distance={1.5} intensity={4.0} />
        </group>

        {!holding && !matchLit && showHelper && phase === "match-ignite" && (
          <Html center position={[-0.25, 0.08, 0]} zIndexRange={[80, 70]}>
            <motion.div animate={{ rotate: [-2, 2, -2], scale: [1, 1.04, 1] }} className="pointer-events-none whitespace-nowrap bg-transparent text-center text-[14px] font-black leading-tight" style={{ color: '#ffd84d', textShadow: '0 2px 10px rgba(255,216,77,0.5)' }} transition={{ duration: 1.3, repeat: Infinity }}>
              {instructionText ? (<div dangerouslySetInnerHTML={{ __html: instructionText.replace(/\\n/g, '<br/>') }} />) : (<>Quẹt diêm 3 lần<br/>để thắp nến nhé!</>)} {strikeCount > 0 && `(${strikeCount}/3)`}
            </motion.div>
          </Html>
        )}
      </group>

      {phase === "wish-record" && (
        <Html center position={[0, 1.35, 0]} zIndexRange={[90, 80]}>
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center w-[300px]">
             <div className="whitespace-nowrap text-4xl font-black" style={{ color: '#ffd84d', textShadow: '0 2px 10px rgba(255,216,77,0.5)' }}>{wishPromptText || "Hãy ước..."}</div>
             <div className="mt-3 flex items-center justify-center gap-2 text-lg font-bold text-white/90">
               {isPressing ? (
                 <>
                   <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff7fc7] opacity-75"></span><span className="relative inline-flex h-3 w-3 rounded-full bg-[#ff38aa]"></span></span>
                   {recordingText || "Đang ghi âm điều ước..."}
                 </>
               ) : (
                 "Nhấn giữ nút bên dưới để ước"
               )}
             </div>
             {isPressing && (
               <div className="mt-4 flex items-end justify-center gap-1" style={{ height: '48px' }}>
                 {[0,1,2,3,4].map((i) => (
                   <div key={i} id={`record-wave-bar-${i}`} className="w-2 rounded-full bg-gradient-to-t from-pink-500 to-yellow-300" style={{ height: '12px', transition: 'height 0.07s', animationDelay: `${i * 0.1}s` }} />
                 ))}
               </div>
             )}
             <button 
               onPointerDown={handlePressStart}
               onPointerUp={handlePressEnd}
               onPointerCancel={handlePressEnd}
               onContextMenu={(e) => e.preventDefault()}
               style={{ WebkitUserSelect: "none", userSelect: "none", touchAction: "none" }}
               className={`mt-4 px-6 py-4 rounded-2xl border-2 border-white/40 shadow-lg backdrop-blur-md pointer-events-auto transition-all flex items-center gap-3 ${isPressing ? 'bg-pink-500 scale-105 border-pink-300' : 'bg-pink-600/70 hover:bg-pink-500/80'}`}
             >
               <i className={`fas fa-microphone text-2xl ${isPressing ? 'text-white animate-pulse' : 'text-white/90'}`} />
               <span className="text-white font-bold text-base">{isPressing ? (recordingText || "Đang ghi âm...") : "Giữ để ước"}</span>
             </button>
           </motion.div>
        </Html>
      )}
    </>
  );
}

function RingSparkles() {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    angle: (i / 30) * Math.PI * 2,
    radius: 1.2 + (i % 3) * 0.3,
    y: -0.6 + (i % 5) * 0.3,
    size: 0.025 + (i % 4) * 0.015,
    phase: i * 0.63,
  })), []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const p = particles[i];
      const t = state.clock.elapsedTime * 0.6 + p.phase;
      child.position.x = Math.cos(t + p.angle) * p.radius;
      child.position.z = Math.sin(t + p.angle) * p.radius;
      child.position.y = p.y + Math.sin(state.clock.elapsedTime * 1.2 + p.phase) * 0.15;
      child.scale.setScalar(0.6 + Math.sin(state.clock.elapsedTime * 2.5 + p.phase) * 0.4);
    });
  });

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={["#ffb3d9", "#b3d9ff", "#ffffb3", "#d9b3ff"][i % 4]} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export function CelebrationEffects() {
  return (
    <>
      <RingSparkles />
      {/* Pháo hoa, Confetti dâng vừa phải, chắc chắn lọt vào khung hình */}
      <NormalizedModel position={[-2.5, 0.8, -2.0]} desiredHeight={2.0} url={MODELS.confetti} loop />
      <NormalizedModel position={[2.5, 1.0, -2.2]} desiredHeight={2.0} url={MODELS.firework} loop />
      
      <Model position={[0.4, 2.85, 0.4]} scale={0.45} url={MODELS.hat} />
    </>
  );
}

export function BirthdayBanner({ name, title, visible = true, position = [0, 3.2, 0] }: { name: string; title?: string; visible?: boolean; position?: [number, number, number] }) {
  if (!visible) return null;
  return (
    <Html center position={position} zIndexRange={[100, 90]}>
      <div className="pointer-events-none flex w-[800px] justify-center">
        <motion.div
          initial={{ y: -100, rotateX: -90 }}
          animate={{ y: 0, rotateX: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.5 }}
          style={{ transformOrigin: "top center" }}
          className="relative px-8 py-2 drop-shadow-2xl"
        >
          <div className="absolute left-[15%] top-0 h-6 w-1.5 bg-[#e0a6c8]/80 shadow-sm" />
          <div className="absolute right-[15%] top-0 h-6 w-1.5 bg-[#e0a6c8]/80 shadow-sm" />
          
          <div className="mt-4 max-w-[90vw] rounded-b-2xl rounded-t-sm border-b-4 border-[#ffb6e0] bg-gradient-to-b from-[#ffeff8] to-[#ffdbef] px-6 py-3 text-center shadow-[0_10px_20px_rgba(255,120,180,0.4)]">
            <div className="text-xs md:text-sm font-bold tracking-widest text-[#ff59ab] drop-shadow-sm uppercase">{title || "Chúc Mừng Sinh Nhật"}</div>
            <div className={`mt-1 font-black text-[#d6287c] drop-shadow-md uppercase ${name && name.length > 12 ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>{name || "Bạn"}</div>
          </div>
        </motion.div>
      </div>
    </Html>
  );
}

export function GiftFinale({ onOpen, opening, position = [0, 0, 0], celebrationZoom, autoPlay, giftPromptText }: { onOpen: () => void; opening: boolean; position?: [number, number, number]; celebrationZoom?: boolean; autoPlay?: boolean; giftPromptText?: string; }) {
  const [signal, setSignal] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  const [animState, setAnimState] = useState<"idle" | "bouncing" | "opened">("idle");
  const animStart = useRef(0);

  useFrame(() => {
    if (animState !== "bouncing" || !groupRef.current) return;
    const elapsed = (performance.now() - animStart.current) / 1000;
    let y = 0; let sx = 1, sy = 1, sz = 1; let rz = 0;

    if (elapsed < 0.3) {
      const p = elapsed / 0.3; sy = 1 - p * 0.4; sx = sz = 1 + p * 0.3; y = -p * 0.15;
    } else if (elapsed < 0.8) {
      const p = (elapsed - 0.3) / 0.5; y = Math.sin(p * Math.PI) * 1.5; sy = 1 + Math.sin(p * Math.PI) * 0.5; sx = sz = 1 - Math.sin(p * Math.PI) * 0.3; 
    } else if (elapsed < 1.1) {
      const p = (elapsed - 0.8) / 0.3; const bounce = Math.sin(p * Math.PI); sy = 1 - bounce * 0.5; sx = sz = 1 + bounce * 0.4; y = -bounce * 0.1;
    } else if (elapsed < 2.5) {
      const p = (elapsed - 1.1) / 1.4; rz = Math.sin(elapsed * 50) * (0.1 + p * 0.35); y = Math.abs(Math.sin(elapsed * 25)) * 0.15; sy = 1 + Math.sin(elapsed * 30) * 0.1; sx = sz = 1 - Math.sin(elapsed * 30) * 0.05;
    } else if (elapsed < 2.8) {
      const p = (elapsed - 2.5) / 0.3; sy = 1 - p * 0.6; sx = sz = 1 + p * 0.5; y = -p * 0.25; rz = 0;
    } else if (elapsed < 3.2) {
      const p = (elapsed - 2.8) / 0.4; y = Math.sin(p * Math.PI) * 2.2; sy = 1 + Math.sin(p * Math.PI) * 0.7; sx = sz = 1 - Math.sin(p * Math.PI) * 0.4;
    } else {
      sx = sy = sz = 1; y = 0; rz = 0; setAnimState("opened"); setSignal(v => v + 1); onOpen(); 
    }
    groupRef.current.position.y = y; groupRef.current.scale.set(sx, sy, sz); groupRef.current.rotation.z = rz;
  });

  const handleClick = () => { if (animState === "idle" && celebrationZoom) { setAnimState("bouncing"); animStart.current = performance.now(); } };

  useEffect(() => {
    if (autoPlay && celebrationZoom && animState === "idle") {
      const timer = setTimeout(() => { handleClick(); }, 2500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, celebrationZoom, animState]);

  return (
    <group position={position}>
      <group position={[0, 0, 0]}>
        <group ref={groupRef}>
          <NormalizedModel
            onClick={handleClick} playSignal={signal} loop={false} noClone
            desiredHeight={1.2}
            url={MODELS.lootBox}
          />
        </group>
        <pointLight color="#fff0f8" intensity={opening ? 18 : 3} position={[0, 0.45, 0.3]} />
      </group>
      {celebrationZoom && !opening && (
        <Html center position={[-0.1, 0.55, 0.4]} zIndexRange={[80, 70]}>
          <motion.div
            animate={{ rotate: [-2, 2, -2], scale: [1, 1.04, 1] }}
            className="pointer-events-none whitespace-nowrap rounded-none bg-transparent px-2 text-center text-lg font-black leading-tight text-[#ffd84d] drop-shadow-[0_3px_0_rgba(91,35,85,0.22)]"
            transition={{ duration: 1.3, repeat: Infinity }}
          >
            {giftPromptText ? (<div dangerouslySetInnerHTML={{ __html: giftPromptText.replace(/\\n/g, '<br/>') }} />) : (<>Chạm vào hộp quà<br/>để nhận bất ngờ 🎁</>)}
          </motion.div>
        </Html>
      )}
    </group>
  );
}

function VintageDust() {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => Array.from({ length: 200 }, () => ({
    x: -5 + Math.random() * 30, // Trải dài theo dây
    y: 0 + Math.random() * 4,
    z: -2 + Math.random() * 5,
    speed: 0.1 + Math.random() * 0.3,
    size: 0.015 + Math.random() * 0.02,
    phase: Math.random() * Math.PI * 2,
    opacity: 0.2 + Math.random() * 0.5,
  })), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.y = p.y + Math.sin(t * p.speed + p.phase) * 0.2;
      child.position.x = p.x + Math.cos(t * p.speed + p.phase) * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshBasicMaterial color="#ffda9e" transparent opacity={p.opacity} />
        </mesh>
      ))}
    </group>
  );
}

function CurvedRope({ startX, endX, y }: { startX: number; endX: number; y: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ropeMeshRef = useRef<THREE.Mesh>(null);
  const len = endX - startX;

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const frac = i / 30;
      const x = startX + frac * len;
      const normalizedX = (frac - 0.5) * 2;
      const droop = (1 - normalizedX * normalizedX) * 0.8;
      pts.push(new THREE.Vector3(x, y - droop, 0));
    }
    return pts;
  }, [startX, endX, len, y]);

  useFrame((state) => {
    if (!ropeMeshRef.current) return;
    const t = state.clock.elapsedTime * 0.3;
    const curve = new THREE.CatmullRomCurve3(
      points.map((p, i) => {
        const frac = i / 30;
        const sway = Math.sin(frac * Math.PI * 2 + t) * 0.1;
        return new THREE.Vector3(p.x, p.y, sway);
      })
    );
    ropeMeshRef.current.geometry.dispose();
    ropeMeshRef.current.geometry = new THREE.TubeGeometry(curve, 64, 0.015, 8, false);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ropeMeshRef}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 64, 0.015, 8, false]} />
        <meshStandardMaterial color="#4a2e15" roughness={0.8} />
      </mesh>
    </group>
  );
}

function HangingItem({ x, startX, ropeLength, index, children, isLetter = false }: { x: number; startX: number; ropeLength: number; index: number; children: React.ReactNode; isLetter?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * 0.3;
      const frac = (x - startX) / ropeLength;
      const normalizedX = (frac - 0.5) * 2;
      const droop = (1 - normalizedX * normalizedX) * 0.8;
      const sway = Math.sin(frac * Math.PI * 2 + t) * 0.1;
      
      // Ảnh bám chính xác tuyệt đối vào tọa độ võng của dây
      groupRef.current.position.y = 1.8 - droop;
      groupRef.current.position.z = sway;

      // Cảm giác khung ảnh đu đưa độc lập do sức gió
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + index * 0.5) * 0.03;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.6 + index * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[x, 1.8, 0]}>
      {/* Chiếc kẹp gỗ */}
      <mesh position={[0, -0.15, 0.01]}>
        <boxGeometry args={[0.08, 0.3, 0.04]} />
        <meshStandardMaterial color="#8c5a35" roughness={0.9} />
      </mesh>

      <group position={[0, -0.84, 0]}>
        <Html transform distanceFactor={2.8}>
          <div style={{ display: 'inline-block', transform: 'translateX(-50%)' }}>
            {children}
          </div>
        </Html>
      </group>
    </group>
  );
}

export function HangingGallery({
  active,
  memories,
  finalMessage,
  vintageElapsed,
}: {
  active?: boolean;
  memories: { imageUrl: string; message: string }[];
  finalMessage: string;
  vintageElapsed: number;
}) {
  if (!active) return null;
  
  const displayMemories = memories && memories.length > 0 ? memories : [
    { imageUrl: "/assets/lovepics/1.jpg", message: "Kỷ niệm ngọt ngào nhất ❤️" },
    { imageUrl: "/assets/lovepics/2.jpg", message: "Nụ cười rực rỡ của cậu 😊" },
    { imageUrl: "/assets/lovepics/3.jpg", message: "Hành trình tuyệt vời của chúng ta 🌟" },
    { imageUrl: "/assets/lovepics/4.jpg", message: "Mãi bên nhau cậu nhé! 🥰" }
  ];

  // Use consistent startX=-1.5 so camera pan (which uses same formula) lines up perfectly
  const itemStartX = -1.5;
  const memoriesSpan = displayMemories.length * 3.5 + 3.5;
  // Extend rope far left and right so ends are off-screen
  const ropeStartX = -10.0;
  const ropeLength = memoriesSpan + 20.0;
  const ropeEndX = ropeStartX + ropeLength;

  return (
    <group position={[0, 0.0, 0]}>
      {/* ÁNH SÁNG KỈ NIỆM: Vàng ấm, hoài cổ rọi vào các bức ảnh */}
      <ambientLight color="#ffc485" intensity={0.5} />
      <directionalLight color="#ffab45" intensity={1.8} position={[2, 4, 3]} />
      
      {/* HỆ THỐNG BỤI VÀNG LƠ LỬNG */}
      <VintageDust />

      <Html>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Dancing+Script:wght@700&display=swap');
          .polaroid-card {
            background: #fffaeb; /* Viền giấy ngả vàng sậm */
            padding: 10px 10px 24px 10px;
            box-shadow: 0 15px 35px rgba(20, 10, 0, 0.5), 0 5px 15px rgba(20, 10, 0, 0.4);
            border-radius: 4px;
            width: 220px;
            border: 1px solid #dcd2b6;
            transform-origin: top center;
            user-select: none;
          }
          .polaroid-img {
            width: 200px;
            height: 180px;
            object-fit: cover;
            border: 1px solid rgba(0,0,0,0.1);
            background: #eee;
            filter: sepia(0.4) contrast(1.15) brightness(0.95);
          }
          .polaroid-caption {
            font-family: 'Caveat', cursive;
            font-size: 24px;
            color: #4a3018;
            text-align: center;
            margin-top: 14px;
            line-height: 1.2;
            word-wrap: break-word;
          }
          .envelope-card {
            background: #fffaeb;
            padding: 30px;
            border-radius: 8px;
            width: 320px;
            box-shadow: 0 15px 40px rgba(20, 10, 0, 0.6);
            border: 2px solid #d4c1a5;
            text-align: center;
            position: relative;
            transform-origin: top center;
            box-sizing: border-box;
          }
          .envelope-card::before {
            content: '';
            position: absolute;
            inset: 8px;
            border: 1px dashed #b89c7c;
            pointer-events: none;
          }
          .letter-text {
            font-family: 'Dancing Script', cursive;
            font-size: 28px;
            line-height: 1.45;
            color: #3b200b;
            text-shadow: 0px 1px 1px rgba(255,255,255,0.5);
          }
        `}} />
      </Html>

      {/* Dây thừng toán học (Parabol) */}
      <CurvedRope startX={ropeStartX} endX={ropeEndX} y={1.8} />

      {displayMemories.map((memory, index) => {
        const xPos = itemStartX + 1.5 + index * 3.5;
        return (
          <HangingItem key={index} x={xPos} startX={ropeStartX} ropeLength={ropeLength} index={index}>
            <div className="polaroid-card">
              <MediaDisplay src={memory.imageUrl} className="polaroid-img" alt="Memory" />
              <div className="polaroid-caption">{memory.message}</div>
            </div>
          </HangingItem>
        );
      })}

      <HangingItem x={itemStartX + 1.5 + displayMemories.length * 3.5} startX={ropeStartX} ropeLength={ropeLength} index={displayMemories.length} isLetter>
        <div className="envelope-card">
          <div className="letter-text">{finalMessage}</div>
        </div>
      </HangingItem>
    </group>
  );
}

function SingleAnimatedBalloon({ data, active, mountTime }: { data: any, active: boolean, mountTime: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const localTime = useRef(0);
  
  useFrame((state, delta) => {
    if (!groupRef.current || !active) {
        localTime.current = 0;
        return;
    }
    // Chống lag giật cục khi React tải model mới nặng
    const safeDelta = Math.min(delta, 0.05); 
    localTime.current += safeDelta;
    
    const elapsed = localTime.current;
    const t = Math.max(0, elapsed - data.delay);

    groupRef.current.visible = elapsed > data.delay;

    if (elapsed > data.delay) {
      // 1. TÍNH TOÁN TỌA ĐỘ LOCAL (Gốc 0,0,0 là tâm ống kính Camera)
      const localX = data.isWall ? data.x : data.x + Math.sin(t * 1.5 + data.drift) * 0.2;
      const localY = data.y + t * data.speed;
      const localZ = -data.zDist; // Âm = Nằm ngay trước ống kính

      // 2. DÁN CHẶT VÀO CAMERA: Áp dụng vị trí và góc quay của Camera lên bóng bay
      groupRef.current.position.set(localX, localY, localZ);
      groupRef.current.position.applyMatrix4(state.camera.matrixWorld);
      groupRef.current.quaternion.copy(state.camera.quaternion);
      
      // 3. Cho bóng tự xoay nhẹ
      groupRef.current.rotateY(data.rot + (data.isWall ? 0 : t * 0.1));
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <NormalizedModel desiredHeight={data.scale} url={MODELS.balloons} loop materialTone="glow" noClone={false} />
    </group>
  );
}

export function BalloonShower({ active }: { active?: boolean }) {
  const [mountTime, setMountTime] = useState(-1);

  useEffect(() => {
    if (active) setMountTime(performance.now());
    else setMountTime(-1);
  }, [active]);

  const balloonData = useMemo(() => {
    const arr: any[] = [];
    
    // ĐỢT 1: Bóng nền bay lơ lửng (Dày đặc hơn)
    for (let i = 0; i < 60; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 12.0, 
        y: -8.0 - Math.random() * 4.0, 
        speed: 2.5 + Math.random() * 2.0, 
        drift: (Math.random() - 0.5) * 1.5,
        scale: 2.0 + Math.random() * 2.0, 
        delay: Math.random() * 9.0, 
        rot: Math.random() * Math.PI * 2,
        zDist: 1.5 + Math.random() * 2.0, 
        isWall: false,
      });
    }
    
    // ĐỢT 2: BỨC TƯỜNG BÓNG CHE CAMERA (Số lượng lớn, phóng siêu to)
    for (let i = 0; i < 14; i++) {
      arr.push({ 
          x: -6.5 + i * 1.0, 
          y: -9.0, 
          speed: 4.8, 
          drift: 0, 
          scale: 18.0, // Phóng siêu to để bao trọn mọi góc viền màn hình
          delay: 7.0, 
          rot: Math.random() * Math.PI, 
          zDist: 1.0, // Cách Camera đúng 1.0 unit để không bị cắt lỗi (Clipping)
          isWall: true 
      });
    }
    return arr;
  }, []);

  if (!active || mountTime < 0) return null;

  return (
    <group>
      {balloonData.map((b, i) => (
        <SingleAnimatedBalloon key={i} data={b} active={active} mountTime={mountTime} />
      ))}
    </group>
  );
}

