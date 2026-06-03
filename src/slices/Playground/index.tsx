"use client";

import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/bounded";
import { FadeIn } from "@/components/FadeIn";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import { Switch } from "./Switch";
import { Stage } from "@react-three/drei";

/**
 * Props for `Playground`.
 */
export type PlaygroundProps = SliceComponentProps<Content.PlaygroundSlice>;

/**
 * Component for "Playground" Slices.
 */
const Playground: FC<PlaygroundProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative"
      innerClassName="flex flex-col justify-center"
    >
    <FadeIn>
      <PrismicRichText field={slice.primary.heading} components={{
        heading2: ({ children }) => (
          <h2 className="font-bold-slanted text-6xl md:text-8xl uppercase">{children}</h2>
        )
      }} />

<div className="mb-6 max-w-4xl text-xl text-pretty">

    <PrismicRichText field={slice.primary.description} />
    
</div>
    
    <FadeIn targetChildren className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
    {slice.primary.switches.map((item) => isFilled.contentRelationship(item.switch) ? (
        <SharedCanvas key={item.switch.id} color={item.switch} />
): null)}
</FadeIn>
    </FadeIn>
    </Bounded>
  );
};

export default Playground;


type SharedCanvasProps = {
  color: Content.PlaygroundSliceDefaultPrimarySwitchesItem["switch"]
}

const SharedCanvas= ({ color }: SharedCanvasProps) => {

if (!isFilled.contentRelationship(color)  || !color.data) return null;

const colorName = color.uid as "red" | "blue" | "black" | "brown" ;
const {color:hexColor, name} = color.data;


const bgColor = {
  blue : "bg-sky-950"
  , red : "bg-red-950",
  black : "bg-gray-900",
  brown : "bg-amber-950"
}

return (
  <div className="group relative min-h-96 overflow-hidden rounded-3xl select-none">
    {/*text button*/}


    <Canvas camera={{position: [1.5, 2,0], fov:7}} >
      <Stage adjustCamera={2} intensity={.5} shadows={"contact"} environment="city" >
      <Switch  rotation ={[0,Math.PI /4,0]} color={colorName} hexColor={hexColor || ""} scale={0.5}/>

      </Stage>
    </Canvas>


    <div className={clsx(
      "absolute inset-0 -z-10 overflow-hidden",
      bgColor[colorName],
    )}>
<svg className="pointer-events-none absolute top-0 left-0 h-auto w-full mix-blend-overlay" viewBox="0 0 75 100">
  <text
    fontSize={7}
    textAnchor="middle"
    dominantBaseline="middle"
    x="50%"
    className="font-black-slanted fill-white/20 uppercase motion-safe:transition-all motion-safe:duration-700 group-hover:fill-white "
  >
    {Array.from({length: 20}, (_, i) => (
      <tspan key={i} x={`${(i + 1) * 10}%`} dy={i === 0 ? -50 : 6}>
        {Array.from({length: 10}, () => colorName).join("  ")}
      </tspan>
    ))}
  </text>
</svg>

    </div>


  </div>
)

}