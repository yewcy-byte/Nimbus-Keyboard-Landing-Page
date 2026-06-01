import * as THREE from "three"
import { Keyboard } from "@/components/Keyboard"
import { Stage, useTexture } from "@react-three/drei"
import { useMemo } from "react"
import { KEYCAP_TEXTURES } from "."

type SceneProps = {
    selectedTexture: string
    onAnimationComplete: () => void
}

export function Scene({ selectedTexture, onAnimationComplete: _onAnimationComplete }: SceneProps) {
    const texturePaths = KEYCAP_TEXTURES.map((t) => t.path)
    const textures = useTexture(texturePaths)

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
            <group>
                <Keyboard keycapMaterial={materials[selectedTexture]} knobColor={currentKnobColor} />
            </group>
        </Stage>
    )
}
