"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Logo3DMesh() {
  const groupRef = useRef<THREE.Group>(null);

  // Define the exact shapes of the FreeWheel emblem
  const { topBarGeom, leftWingGeom, rightWingGeom } = useMemo(() => {
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.05,
    };

    // 1. Top Bar Trapezoid
    const topBarShape = new THREE.Shape();
    topBarShape.moveTo(-2.2, 1.35);
    topBarShape.lineTo(0.8, 1.35);
    topBarShape.lineTo(0.46, 0.83);
    topBarShape.lineTo(-1.86, 0.83);
    topBarShape.closePath();

    // 2. Left F-Wing & Center Crossbar
    const leftWingShape = new THREE.Shape();
    leftWingShape.moveTo(-1.77, 0.63);
    leftWingShape.lineTo(0.02, 0.63);
    leftWingShape.lineTo(-0.26, 0.21);
    leftWingShape.lineTo(-1.04, 0.21);
    leftWingShape.lineTo(-0.4, -0.84);
    leftWingShape.lineTo(-0.69, -1.24);
    leftWingShape.closePath();

    // 3. Right W-Wing & Chevron
    const rightWingShape = new THREE.Shape();
    rightWingShape.moveTo(2.02, 0.98);
    rightWingShape.lineTo(1.47, 0.98);
    rightWingShape.lineTo(0.6, -0.33);
    rightWingShape.lineTo(0.13, 0.32);
    rightWingShape.lineTo(-0.41, -0.47);
    rightWingShape.lineTo(-0.21, -0.81);
    rightWingShape.lineTo(0.11, -0.41);
    rightWingShape.lineTo(0.62, -1.1);
    rightWingShape.lineTo(1.1, -0.35);
    rightWingShape.closePath();

    return {
      topBarGeom: new THREE.ExtrudeGeometry(topBarShape, extrudeSettings),
      leftWingGeom: new THREE.ExtrudeGeometry(leftWingShape, extrudeSettings),
      rightWingGeom: new THREE.ExtrudeGeometry(rightWingShape, extrudeSettings),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.4;

    if (groupRef.current) {
      // Gentle breathing rotation + responsive mouse tilt
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15 + mouseX;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08 - mouseY * 0.8;
      groupRef.current.rotation.z = Math.cos(t * 0.25) * 0.04;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 0.15, 0]} scale={1.15}>
        {/* Top Bar - Cyan Neon Metal */}
        <mesh geometry={topBarGeom} castShadow receiveShadow>
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#0077CC"
            emissiveIntensity={0.45}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Left Wing - Electric Blue */}
        <mesh geometry={leftWingGeom} castShadow receiveShadow>
          <meshStandardMaterial
            color="#087CFF"
            emissive="#0044BB"
            emissiveIntensity={0.4}
            metalness={0.88}
            roughness={0.18}
          />
        </mesh>

        {/* Right Wing - Gradient Sapphire Cyan */}
        <mesh geometry={rightWingGeom} castShadow receiveShadow>
          <meshStandardMaterial
            color="#00A8FF"
            emissive="#0055DD"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Internal Core Light Flares */}
        <pointLight position={[0, 0.2, 0.8]} intensity={2.5} color="#00E5FF" distance={5} />
        <pointLight position={[-0.8, -0.4, 0.6]} intensity={1.8} color="#087CFF" distance={4} />
      </group>
    </Float>
  );
}

function HologramPlatform() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group position={[0, -2.4, 0]}>
      {/* Dark metallic base cylinder */}
      <mesh>
        <cylinderGeometry args={[2.8, 3.2, 0.25, 64]} />
        <meshStandardMaterial color="#040914" metalness={0.95} roughness={0.18} />
      </mesh>

      {/* Rotating holographic energy rings */}
      <group ref={ringsRef} position={[0, 0.13, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.62, 64]} />
          <meshBasicMaterial color="#00D2FF" side={THREE.DoubleSide} transparent opacity={0.7} />
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
      <pointLight position={[0, 0.8, 0]} intensity={2.2} color="#00D2FF" distance={5} />
    </group>
  );
}

export const Logo3D = () => {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[550px] relative">
      <Canvas camera={{ position: [0, 0.3, 6.8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 8, 5]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-6, -4, -3]} intensity={1.0} color="#087CFF" />
        <directionalLight position={[0, 5, -5]} intensity={0.6} color="#00D2FF" />

        <Logo3DMesh />
        <HologramPlatform />
        <Sparkles count={55} scale={6.5} size={2.5} speed={0.4} opacity={0.7} color="#00D2FF" />
      </Canvas>

      {/* Ambient background blend glow */}
      <div className="absolute inset-0 bg-primary/10 blur-[130px] -z-10 rounded-full pointer-events-none" />
    </div>
  );
};
