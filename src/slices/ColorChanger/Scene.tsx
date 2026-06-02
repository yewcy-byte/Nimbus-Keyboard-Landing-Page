import * as THREE from "three"
import { Keyboard } from "@/components/Keyboard"
import { Stage, useTexture } from "@react-three/drei"
import { useMemo, useRef, useState } from "react"
import { KEYCAP_TEXTURES } from "."
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

gsap.registerPlugin(useGSAP)

type SceneProps = {
    selectedTexture: string
    onAnimationComplete: () => void
}

export function Scene({ selectedTexture, onAnimationComplete: _onAnimationComplete }: SceneProps) {
    const texturePaths = KEYCAP_TEXTURES.map((t) => t.path)
    const textures = useTexture(texturePaths)
    const keyboardRef = useRef<THREE.Group>(null)
    const [currentTextureId , setCurrentTextureId] = useState(selectedTexture)

    useGSAP(()=>{
        //animate keyboard

        if (!keyboardRef.current || selectedTexture === currentTextureId) return;

        const keyboard = keyboardRef.current;

        const tl = gsap.timeline({
            onComplete:()=>{
                _onAnimationComplete();
            }
        })

        tl.to(keyboard.position, { y: .3, duration: .4 , ease: "power2.out", onComplete:()=>{
            setCurrentTextureId(selectedTexture)
        } })
        
        tl.to(keyboard.position, { y: 0, duration: .6 , ease: "elastic.out(1,0.4)"})





    },[selectedTexture] )

    const materials = useMemo(() => {
        const materialMap: { [key: string]: THREE.MeshStandardMaterial } = {}

        KEYCAP_TEXTURES.forEach((textureConfig, index) => {
            const texture = Array.isArray(textures) ? textures[index] : textures

            if (texture) {
                texture.flipY = false
                texture.colorSpace = THREE.SRGBColorSpace

                materialMap[textureConfig.id] = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.7,
                })
            }
        })
        return materialMap
    }, [textures])


    const currentKnobColor = KEYCAP_TEXTURES.find((t) => t.id === selectedTexture)?.knobColor || "#E24818";

    return (
        <Stage environment="city" intensity={0.05} shadows="contact">
            <group ref={keyboardRef}>
                <Keyboard keycapMaterial={materials[currentTextureId]} knobColor={currentKnobColor} />
            </group>
        </Stage>
    )
}
