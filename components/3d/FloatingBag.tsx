'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Particle system for magical effect
function Particles({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 30; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
        ],
        speed: Math.random() * 0.02 + 0.01,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    const targetX = mouse.current.x * 2;
    const targetY = mouse.current.y * 2;
    mesh.current.position.x += (targetX - mesh.current.position.x) * 0.02;
    mesh.current.position.y += (targetY - mesh.current.position.y) * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap((p) => p.position))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c9a87c"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Shopping Bag 3D Model
function ShoppingBag({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const bagRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(time * 0.8) * 0.15;
    const targetRotationX = mouse.current.y * 0.3;
    const targetRotationY = mouse.current.x * 0.5;
    group.current.rotation.x += (targetRotationX - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetRotationY - group.current.rotation.y) * 0.05;
  });

  return (
    <group ref={group}>
      <mesh ref={bagRef} castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 2.5, 1]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.3, 0.51]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -0.3, 0.52]}>
        <planeGeometry args={[1, 0.3]} />
        <meshBasicMaterial color="#c9a87c" />
      </mesh>
      <mesh position={[-0.6, 0.8, 0]} castShadow>
        <torusGeometry args={[0.4, 0.08, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#8b7355" roughness={0.4} />
      </mesh>
      <mesh position={[0.6, 0.8, 0]} castShadow>
        <torusGeometry args={[0.4, 0.08, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#8b7355" roughness={0.4} />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[1.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#c9a87c" emissive="#c9a87c" emissiveIntensity={0.2} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh position={[-1.3, -1, 0.8]}>
          <octahedronGeometry args={[0.12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

// Main Scene Component
function Scene() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, 0]} intensity={0.5} color="#c9a87c" />
      <ShoppingBag mouse={mouse} />
      <Particles mouse={mouse} />
      <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={10} blur={2} far={4} />
      <Environment preset="city" />
    </>
  );
}

export default function FloatingBag() {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <Scene />
      </Canvas>
    </div>
  );
}