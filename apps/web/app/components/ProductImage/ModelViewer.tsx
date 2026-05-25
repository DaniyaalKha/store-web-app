'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // rotate on Y axis (horizontally)
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={modelRef} scale={[3, 3, 3]}>
      <primitive object={scene} />
    </group>
  );
}

function Lighting() {
  return (
    <>
      {/* main light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        color="#ffffff"
      />
      {/* side fill light */}
      <directionalLight
        position={[-5, 3, 3]}
        intensity={0.6}
        color="#ffffff"
      />
      {/* back light*/}
      <directionalLight
        position={[0, 5, -5]}
        intensity={0.4}
        color="#ffffff"
      />
      {/* rim light */}
      <directionalLight
        position={[0, -2, -8]}
        intensity={1.2}
        color="#ffffff"
      />
      {/* ambient light */}
      <ambientLight intensity={1.2} />
    </>
  );
}

interface ModelViewerProps {
  modelUrl?: string;
}

export default function ModelViewer({ modelUrl = '/products/models/RTX_3080.glb' }: ModelViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(9, 9, 9)',
      }}
    >
      <Suspense fallback={null}>
        <Model url={modelUrl} />
        <Lighting />
      </Suspense>
    </Canvas>
  );
}
