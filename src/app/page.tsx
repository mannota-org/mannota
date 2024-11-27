import Link from "next/link";
import { HydrateClient } from "@/trpc/server";
import Onboarding from "@/app/_components/Onboarding";
import { Dashboard } from "@/app/dashboard/page";

export default async function Home() {
  return (
    <HydrateClient>
      <Onboarding />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Dashboard />
        </div>
      </main>
    </HydrateClient>
  );
}
