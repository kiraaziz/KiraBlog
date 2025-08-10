import LightRays from "@/components/ui/LightRays"
import Link from "next/link"

const NotFound = () => {

    return (
        <div className="h-full w-full overflow-hidden">
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
                Kira Blog
            </Link>
            <div className="lg:max-w-[80%] w-full p-3 bg-foreground/5 animate-pulse border-y border-foreground/10 mx-auto my-10 overflow-auto tag-scroller">
                <div className="flex flex-row mx-auto w-max gap-6 h-10 ">

                </div>
            </div>
            <div className="w-full h-[60svh] flex items-center justify-center px-5">
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl font-bold mb-4 text-destructive">404</h1>
                    <p className="text-lg mb-6 text-muted-foreground">Sorry, this blog post was not found or is not published.</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound