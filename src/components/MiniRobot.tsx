import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Robot() {
  const groupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle idle sway
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
    // Eye blink
    if (leftEyeRef.current && rightEyeRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 3) > 0.97 ? 0.1 : 1;
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
    }
  });

  const bodyColor = "#2dd4a8";
  const darkMetal = "#1a2332";
  const eyeGlow = "#5eead4";

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={groupRef} scale={1.1}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.4, 0.9]} />
          <meshStandardMaterial color={darkMetal} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Chest plate */}
        <mesh position={[0, 0.05, 0.46]}>
          <boxGeometry args={[0.8, 0.9, 0.05]} />
          <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.3} emissive={bodyColor} emissiveIntensity={0.15} />
        </mesh>

        {/* Chest light */}
        <mesh position={[0, -0.1, 0.5]}>
          <circleGeometry args={[0.12, 16]} />
          <meshStandardMaterial color={eyeGlow} emissive={eyeGlow} emissiveIntensity={2} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[1, 0.8, 0.8]} />
          <meshStandardMaterial color={darkMetal} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Face plate */}
        <mesh position={[0, 1.1, 0.41]}>
          <boxGeometry args={[0.75, 0.55, 0.05]} />
          <meshStandardMaterial color="#0f1a26" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Left eye */}
        <mesh ref={leftEyeRef} position={[-0.2, 1.15, 0.45]}>
          <circleGeometry args={[0.1, 16]} />
          <meshStandardMaterial color={eyeGlow} emissive={eyeGlow} emissiveIntensity={3} />
        </mesh>

        {/* Right eye */}
        <mesh ref={rightEyeRef} position={[0.2, 1.15, 0.45]}>
          <circleGeometry args={[0.1, 16]} />
          <meshStandardMaterial color={eyeGlow} emissive={eyeGlow} emissiveIntensity={3} />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 1.65, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.35]} />
          <meshStandardMaterial color={darkMetal} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={1.5} />
        </mesh>

        {/* Left arm */}
        <mesh position={[-0.85, 0.1, 0]}>
          <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
          <meshStandardMaterial color={darkMetal} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Right arm */}
        <mesh position={[0.85, 0.1, 0]}>
          <capsuleGeometry args={[0.12, 0.7, 8, 16]} />
          <meshStandardMaterial color={darkMetal} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Left leg */}
        <mesh position={[-0.3, -1.05, 0]}>
          <capsuleGeometry args={[0.14, 0.6, 8, 16]} />
          <meshStandardMaterial color={darkMetal} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Right leg */}
        <mesh position={[0.3, -1.05, 0]}>
          <capsuleGeometry args={[0.14, 0.6, 8, 16]} />
          <meshStandardMaterial color={darkMetal} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Left foot */}
        <mesh position={[-0.3, -1.5, 0.1]}>
          <boxGeometry args={[0.3, 0.15, 0.45]} />
          <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Right foot */}
        <mesh position={[0.3, -1.5, 0.1]}>
          <boxGeometry args={[0.3, 0.15, 0.45]} />
          <meshStandardMaterial color={bodyColor} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

const MiniRobot = () => {
  return (
    <div className="w-full h-[320px] md:h-[400px]">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 5, 4]} intensity={1.2} />
          <pointLight position={[-3, 2, 2]} intensity={0.6} color="#5eead4" />
          <Robot />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MiniRobot;
