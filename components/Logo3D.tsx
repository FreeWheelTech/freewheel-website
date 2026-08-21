"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Text3D, Center, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function LogoMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      {/* We will use a stylized 3D shape representing 'FW' as a placeholder since we don't have the actual 3D model */}
      <group ref={meshRef}>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#00A8FF" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#087CFF" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.8, -0.2, 0]}>
          <boxGeometry args={[0.5, 1.6, 0.5]} />
          <meshStandardMaterial color="#00A8FF" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Glow effect */}
        <pointLight position={[0, 0, 1]} distance={4} intensity={2} color="#087CFF" />
      </group>
    </Float>
  );
}

function Platform() {
  return (
    <group position={[0, -2.5, 0]}>
      <mesh>
        <cylinderGeometry args={[3, 3.2, 0.2, 64]} />
        <meshStandardMaterial color="#030712" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <ringGeometry args={[2.8, 2.9, 64]} />
        <meshBasicMaterial color="#00A8FF" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <ringGeometry args={[2.0, 2.1, 64]} />
        <meshBasicMaterial color="#087CFF" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, 1, 0]} intensity={1.5} color="#00A8FF" distance={5} />
    </group>
  );
}

export const Logo3D = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#087CFF" />
        <Environment preset="city" />
        
        <LogoMesh />
        <Platform />
        <Sparkles count={50} scale={6} size={2} speed={0.4} opacity={0.5} color="#00A8FF" />
      </Canvas>
      
      {/* Fallback/Overlay glow for 2D blend */}
      <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10 rounded-full" />
    </div>
  );
};
