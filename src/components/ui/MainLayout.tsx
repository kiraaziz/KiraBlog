"use client"
import LightRays from "@/components/ui/LightRays";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function RootLayout({
    children,
    settings,
}: any) {

    const pathName = usePathname()

    const title = settings.find((v: any) => v.key === "title").value
    const footer = settings.find((v: any) => v.key === "footer").value
    const tags = settings.find((v: any) => v.key === "tags").value.split(",").map((v: any) => v.trim().toLowerCase())

    return (
        <div className="h-full w-full overflow-x-hidden overflow-y-auto">
            <div className="-z-50 fixed opacity-60 h-full w-full">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#4300FF"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                    className="custom-rays"
                />
            </div>
            <Link href={"/"} className="w-full flex items-center justify-center mt-10 text-5xl font-comic">
                {title}
            </Link>
            <div className="lg:max-w-[80%] w-full p-3 border-y border-foreground/10 mx-auto my-10 overflow-auto tag-scroller">
                <div className="flex flex-row mx-auto w-max gap-6">
                    {tags.map((tag: any) => (
                        <Link
                            key={tag}
                            href={`/tag/${tag}`}
                            className="capitalize text-foreground/70 text-base">
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>
            <Suspense key={pathName} fallback={<div className="w-full h-[60svh] flex items-center justify-center">
                <span className="loader"></span>
            </div>}>
                <div className="w-full min-h-[90svh]">
                    {children}
                </div>
                <footer className="px-6 w-full text-center py-6 text-foreground/60 text-sm border-t border-foreground/10 mt-10">
                    {footer}
                </footer>
            </Suspense>
        </div>
    );
}
