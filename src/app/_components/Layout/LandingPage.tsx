import { TypedComponent } from "@/components/ui/type-animation";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const LandingPage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <nav className="sticky top-0 z-20 bg-white px-8 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center justify-start space-x-4">
            <Image src="/logo.png" alt="logo" width={26} height={26} />
            <span className="text-xl font-bold">Mannota</span>
          </div>
          <div className="flex items-center justify-end space-x-4">
            <Button className="rounded-xl bg-[#5AA676] px-4 py-2 text-lg font-medium text-white">
              <SignInButton mode="modal" />
            </Button>
          </div>
        </div>
      </nav>
      <div className="relative z-10 flex h-full flex-col">
        <main className="flex h-full flex-grow flex-col justify-center">
          <div className="relative flex h-full w-full items-center justify-center bg-background">
            <div className="container relative z-10 mx-auto flex h-full items-center justify-center px-4 lg:px-8">
              <section className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-6 text-center">
                <h1 className="mb-4 max-w-screen-xl text-6xl font-extrabold tracking-tight text-gray-800 ">
                  <TypedComponent /> <br /> with Mannota
                </h1>
                <p className="mb-32 text-xl text-gray-600">
                  Improve the quality of medical texts in active learning models<br/> with real-time annotation by medical experts.
                </p>
              </section>
            </div>
            <AnimatedGridPattern
              numSquares={30}
              maxOpacity={0.1}
              duration={3}
              repeatDelay={1}
              className={cn(
                "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                "absolute inset-x-0 top-[-10%] z-0 h-[90%] w-full skew-y-12",
                "clip-path:polygon(0 0, 100% 0, 100% 0%, 0 100%)",
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
