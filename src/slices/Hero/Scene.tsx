"use client"

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Keyboard } from '@/components/Keyboard'
import { Keycap } from '@/components/Keycap'
import { useGSAP } from '@gsap/react'
import { Environment, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

useGLTF.setDecoderPath('/draco/')

gsap.registerPlugin(useGSAP, ScrollTrigger)

function CameraController() {

const { camera, size } = useThree();
const mouseRef = useRef({ x: 0.5, y: 0.5 });
const targetRef = useRef(new THREE.Vector3(0,0,0));
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const currentPositionRef = useRef(new THREE.Vector3(0,0,4));


const baseCameraPosition = {
    x: 0,
    y: 0,
    z:4
}

useFrame(() => {
 const mouse = mouseRef.current;

 if (prefersReducedMotion) {
  
    return;
 }

 const tiltx = (mouse.y - 0.5) * 0.2; // Adjust the multiplier for more/less tilt
 const tilty = (mouse.x - 0.5) * 0.2;

 const targetPosition = new THREE.Vector3(baseCameraPosition.x + tilty, 
    baseCameraPosition.y - tiltx, baseCameraPosition.z);

currentPositionRef.current.lerp(targetPosition, 0.1); // Smoothly interpolate to the new position
camera.position.copy(currentPositionRef.current);
camera.lookAt(targetRef.current);
 

})

useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = event.clientX / size.width;
        mouseRef.current.y = event.clientY / size.height;
    }

    if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', handleMouseMove);
    }

    return () =>window.removeEventListener('mousemove', handleMouseMove);
      
}, [size])


return null;
}


export function Scene() {

    const keyboardGroupRef = useRef<THREE.Group>(null)

    const [lightIntensityScaler, setLightIntensityScaler] = useState(0);


const {positionX, positionY, positionZ, rotationX, rotationY, rotationZ} = useControls(
    {positionX : 0, positionY : -0.5, positionZ : 3, rotationX : Math.PI / 2, rotationY : 0, rotationZ : 0},)

    const scalingFactor = window.innerWidth < 500 ? .5 : 1

    useGSAP(()=>{
        

        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
if (!keyboardGroupRef.current) return;

const keyboard = keyboardGroupRef.current;

gsap.to(
    {lightIntensityScaler: 0},
    {
        lightIntensityScaler: 1,
        duration: 2,
    delay:.5,
ease: "power2.inOut",
onUpdate: function() {
    setLightIntensityScaler(this.targets()[0].lightIntensityScaler)
}
    }
)

const tl = gsap.timeline({
    ease : "power2.inOut"
})

tl.to(keyboard.position, {
    x:0,
    y:-.5,
    z:.5,
    duration: 2

}).to(keyboard.rotation, {
  x:1.4,
    y:0,
    z:.0,
    duration: 1.8,


}, "<")

.to(keyboard.position,{
    x:.2,
    y:-.5,
    z:1.9,
    duration: 2,
    delay: .5
}).to(keyboard.rotation, {
  x:1.6,
    y:0.4,
    z:.0,
    duration: 2


}, "<").call(()=>{
    if (!keyboard) return;

    const scrollTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
        }
    })
    scrollTimeline.to(keyboard.position, {
        x:0, y:-.5, x:2.2

    })


});
    });

  return (
    <group>
        <CameraController  />
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />


        <group scale={scalingFactor}>


<group ref={keyboardGroupRef} >

     <Keyboard scale={9}/>

</group>
<group>
    <Keycap position={[0, -0.4, 2.6]} rotation={[0,2,3]}texture={0} />
    <Keycap position={[-1.4, 0, 2.3]} rotation={[3,2,1]} texture={1} />
    <Keycap position={[-1, 1, 1.5]} rotation={[0,1,3]} texture={2} />
    <Keycap position={[0, 1, 1]} rotation={[0,4,2]} texture={3} />
    <Keycap position={[0.7, .9, 1.4]} rotation={[3,2,0]} texture={4} />
    <Keycap position={[1.3, -0.3, 2.3]} rotation={[1,2,0]} texture={5} />
    <Keycap position={[0, 1, 2]} rotation={[2,2,3]} texture={6} />
    <Keycap position={[-.7, .6, .2]} rotation={[1,4,0]} texture={7} />
    <Keycap position={[-.77, .1, 2.8]} rotation={[3,2,3]} texture={8} />
    <Keycap position={[2, 0, 1]} rotation={[0,0,3]} texture={7} />
</group>

        </group>

<Environment files={["/hdr/blue-studio.hdr"]} environmentIntensity={0.2 * lightIntensityScaler} />

     <spotLight position={[-2, 1.5, 3]} intensity={30 * lightIntensityScaler} castShadow shadow-bias={-0.0002} shadow-normalBias={0.002} shadow-mapSize={[1024]}/>
    </group>
  )
}

export default Scene