"use client"

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";



export const SOUND_MAP = {
    red:["/sounds/red-1.mp3", "/sounds/red-2.mp3", "/sounds/red-3.mp3"],
    blue:["/sounds/blue-1.mp3", "/sounds/blue-2.mp3", "/sounds/blue-3.mp3"],
    brown:["/sounds/brown-1.mp3", "/sounds/brown-2.mp3", "/sounds/brown-3.mp3"],
    black:["/sounds/black-1.mp3", "/sounds/black-2.mp3", "/sounds/black-3.mp3"],
}


// Type definitions
type GLTFResult = GLTF & {
  nodes: {
    Single_Switch_Mesh_1: THREE.Mesh;
    Single_Switch_Mesh_2: THREE.Mesh;
    Single_Switch_Mesh_3: THREE.Mesh;
    Single_Switch_Mesh_4: THREE.Mesh;
  };
  materials: Record<string, unknown>;
};

type SwitchProps = React.ComponentProps<"group"> & {

color: "red" | "blue" | "brown" | "black"
hexColor: string

}


export function Switch({color, hexColor, ...restProps}: SwitchProps) {
  const { nodes } = useGLTF("/switch.gltf") as unknown as GLTFResult;
    const switchGroupRef = React.useRef<THREE.Group>(null);
    const stemRef = React.useRef<THREE.Mesh>(null);
    const isPressedRef = useRef(false);
    const audio = useRef<HTMLAudioElement | null>(null);
const audioTimeout = useRef<ReturnType<typeof setTimeout>>(null);
const allAudio = useRef(SOUND_MAP[color].map((src) => {
    const audio = new Audio(src);
    audio.volume = 0.6;
    return audio;
}));

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
       event.stopPropagation();

       if(!stemRef.current || isPressedRef.current || !switchGroupRef.current) return;
       isPressedRef.current = true;

              const switchGroup = switchGroupRef.current;

         gsap.to(switchGroup.rotation, {
        x: Math.PI / 2 + 0.1,
        duration: 0.05,
        ease:"power2.out"
       })

       const stem = stemRef.current;
       gsap.to(stem.position, {
        z:0.005,
        duration: 0.08,
        ease:"power2.out"
       })

       audio.current = gsap.utils.random(allAudio.current);
         audio.current.currentTime = 0;
         audio.current.play();
         audioTimeout.current = setTimeout(() => audio.current?.pause(),(audio.current.duration/ 2) * 1000) // stop audio halfway through to prevent long tail

    }

     const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
       event.stopPropagation();

       if(!stemRef.current || !isPressedRef.current || !switchGroupRef.current) return;
       isPressedRef.current = false;

       const stem = stemRef.current;
       const switchGroup = switchGroupRef.current;

       gsap.to(switchGroup.rotation, {
        x: Math.PI / 2 ,
        duration: .6,
        ease:"elastic.out(1,.3)"
       })

       gsap.to(stem.position, {
        z:0,
        duration: 0.15,
        ease:"elastic.out(1,.3)"
       })

       if(audioTimeout.current)  clearTimeout(audioTimeout.current)
        audio.current?.play();

    }

  return (

<group {...restProps}>
{/*Hitbox*/}

    <mesh position={[0, 0.05, 0]}
    onPointerDown={handlePointerDown}
    onPointerUp={handlePointerUp}
    onPointerOver={() => (document.body.style.cursor = "pointer")}
    onPointerOut={() => (document.body.style.cursor = "default")}
    >
        <boxGeometry args={[.15, .15, .15]} />
        <meshBasicMaterial transparent opacity={0} />
    </mesh>


    
    <group ref={switchGroupRef} scale={10} rotation={[Math.PI / 2, 0, 0]}>
      {/* Switch housing */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Single_Switch_Mesh_1.geometry}
      >
        <meshStandardMaterial color="#999999" roughness={0.7} />
      </mesh>

      {/* Gold contacts */}
      <mesh
   
        castShadow
        receiveShadow
        geometry={nodes.Single_Switch_Mesh_2.geometry}
      >
        <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={1} />
      </mesh>

      {/* Colored stem */}
      <mesh
         ref={stemRef}
        castShadow
        receiveShadow
        geometry={nodes.Single_Switch_Mesh_3.geometry}
      >
        <meshStandardMaterial color={hexColor} roughness={0.7} />
      </mesh>

      {/* Switch base */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Single_Switch_Mesh_4.geometry}
      >
        <meshStandardMaterial color="#999999" roughness={0.7} />
      </mesh>
    </group>
    </group>
  );
}

useGLTF.preload("/switch.gltf");
