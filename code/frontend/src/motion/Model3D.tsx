import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { movement } from "./level";

function Thing({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

/**
 * THE THING ITSELF, TURNING UNDER THE POINTER — a 3D model on a lit stage
 * that the visitor drags round, and that turns slowly by itself until they
 * do. Load it through <Stage3D> (index.ts), which keeps three.js out of every
 * page that does not show one.
 *
 * ONLY WITH A MODEL FILE THE OWNER SUPPLIED (a .glb under public/models/).
 * Nothing here can make one from photographs, and a model of something like
 * the product is not the product. Without WebGL, or for a visitor who asked
 * for less motion, the poster photograph is shown.
 */
export default function Model3D({ src, poster, alt, className = "" }: { src: string; poster: string; alt: string; className?: string }) {
  const still = movement() === "still";
  const fallback = <img src={poster} alt={alt} decoding="async" className="h-full w-full object-contain" />;
  if (still || !src) return <div className={className}>{fallback}</div>;
  return (
    <div data-motion="model" className={className} role="img" aria-label={alt}>
      <Suspense fallback={fallback}>
        <Canvas dpr={[1, 2]} camera={{ fov: 40 }}>
          <Stage intensity={0.6} environment="city" adjustCamera>
            <Thing src={src} />
          </Stage>
          <OrbitControls makeDefault enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.9} />
        </Canvas>
      </Suspense>
    </div>
  );
}
