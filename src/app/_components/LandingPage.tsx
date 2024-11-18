import { TypedComponent } from "@/components/ui/type-animation";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex flex-grow flex-col">
          <div className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-background">
            <div className="container relative z-10 mx-auto flex min-h-screen items-center justify-center px-4 lg:px-8">
              <section className="mx-auto -mt-32 flex w-full max-w-screen-xl flex-col items-center justify-center gap-6 text-center">
                <h1 className="mb-4 max-w-screen-lg text-5xl font-extrabold tracking-tight text-gray-800 sm:text-6xl lg:text-7xl">
                  <TypedComponent /> <br /> with Mannota
                </h1>
                <p className="mb-8 text-xl text-gray-600">
                  Revolutionizing education through innovative assessment tools.
                  <br />
                  Empower your teaching, inspire learning, and unlock every
                  student's potential in the digital era.
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
