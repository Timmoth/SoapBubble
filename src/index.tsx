import { OrbitControls } from "@react-three/drei";
import { Canvas, unmountComponentAtNode, useFrame } from "@react-three/fiber";
import React from "react";
import { useMemo, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import * as THREE from "three";

import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

const CustomGeometryParticles = (props) => {
  const { count, shape } = props;
  const points = useRef<THREE.Points>(null!);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    //golden angle in radians
    let phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      let y = 1 - (i / (count - 1.0)) * 2; // y goes from 1 to -1
      let radius = Math.sqrt(1 - y * y); //# radius at y

      let theta = phi * i; // # golden angle increment

      let x = Math.cos(theta) * radius;
      let z = Math.sin(theta) * radius;
      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count, shape]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
      <ambientLight intensity={0.5} />
      <CustomGeometryParticles count={10000} />
      <OrbitControls autoRotate />
    </Canvas>
  );
};

export function Start() {
  createRoot(document.getElementById("root") as HTMLElement).render(<Scene />);
}

export function Stop() {
  unmountComponentAtNode(document.getElementById("root") as HTMLElement);
}
