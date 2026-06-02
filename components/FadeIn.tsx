"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger)

type FadeInProps = {
    children : React.ReactNode;
    vars? :gsap.TweenVars
    start?: string
    className?: string
    targetChildren?: boolean
}

export function FadeIn({children, vars, start, className, targetChildren = false}:FadeInProps){

    const containerRef = useRef<HTMLDivElement>(null);
    useGSAP(()=>{
        const target = targetChildren ? containerRef.current?.children : containerRef.current;
        if (!target) return;


        gsap.set(target, {opacity: 0, y: 60})

        gsap.to(target, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: start ?? "top 50%",
            },
            duration: .8,
            opacity: 1,
            ease: "power3.out",
            y: 0,
            stagger: 0.2,
            ...vars,
        })
})



    return(
        <div ref={containerRef} className={clsx( className)}>
            {children}
        </div>
    )
}