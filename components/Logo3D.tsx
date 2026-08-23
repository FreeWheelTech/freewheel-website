"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function CyberCore() {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.4;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = t * 0.4 + mouseX;
      outerRingRef.current.rotation.x = Math.sin(t * 0.3) * 0.15 - mouseY;
      outerRingRef.current.rotation.z = Math.cos(t * 0.2) * 0.1;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = -t * 0.6 - mouseX * 0.5;
      innerRingRef.current.rotation.z = t * 0.3;
    }

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.5;
      coreRef.current.rotation.y = t * 0.7;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <group>
        {/* Outer segmented cyber ring */}
        <group ref={outerRingRef}>
          {/* Main torus ring */}
          <mesh>
            <torusGeometry args={[2.0, 0.12, 24, 64]} />
            <meshStandardMaterial
              color="#087CFF"
              emissive="#087CFF"
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>

          {/* Accent outer nodes */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = Math.cos(rad) * 2.0;
            const y = Math.sin(rad) * 2.0;
            return (
              <mesh key={i} position={[x, y, 0]}>
                <boxGeometry args={[0.2, 0.25, 0.25]} />
                <meshStandardMaterial
                  color="#00D0FF"
                  emissive="#00D0FF"
                  emissiveIntensity={0.8}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            );
          })}
        </group>

        {/* Inner Counter-Rotating Orbit Ring */}
        <group ref={innerRingRef}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.4, 0.06, 16, 48]} />
            <meshStandardMaterial
              color="#00D0FF"
              emissive="#00D0FF"
              emissiveIntensity={0.5}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Central Pulsing Tech Core */}
        <mesh ref={coreRef} scale={0.85}>
          <icosahedronGeometry args={[0.9, 2]} />
          <MeshDistortMaterial
            color="#087CFF"
            emissive="#0055CC"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.85}
            distort={0.35}
            speed={2}
          />
        </mesh>

        {/* Inner Light Flare */}
        <pointLight position={[0, 0, 0]} intensity={3} color="#00D0FF" distance={6} />
      </group>
    </Float>
  );
}

function HologramPlatform() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group position={[0, -2.4, 0]}>
      {/* Dark metallic base cylinder */}
      <mesh>
        <cylinderGeometry args={[2.8, 3.1, 0.25, 64]} />
        <meshStandardMaterial color="#040914" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rotating holographic rings */}
      <group ref={ringsRef} position={[0, 0.13, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.62, 64]} />
          <meshBasicMaterial color="#00D0FF" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 1.88, 64]} />
          <meshBasicMaterial color="#087CFF" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 0.95, 48]} />
          <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Upward beam light */}
      <pointLight position={[0, 0.8, 0]} intensity={2} color="#00D0FF" distance={5} />
    </group>
  );
}

export const Logo3D = () => {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[550px] relative">
      <Canvas camera={{ position: [0, 0.5, 7.2], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[6, 8, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-6, -4, -4]} intensity={0.8} color="#087CFF" />
        <pointLight position={[0, 2, 3]} intensity={1.2} color="#00D0FF" />

        <CyberCore />
        <HologramPlatform />
        <Sparkles count={60} scale={6.5} size={2.5} speed={0.4} opacity={0.7} color="#00D0FF" />
      </Canvas>

      {/* Ambient background blend glow */}
      <div className="absolute inset-0 bg-primary/10 blur-[130px] -z-10 rounded-full pointer-events-none" />
    </div>
  );
};
