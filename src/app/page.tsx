import Link from "next/link";
import { HydrateClient } from "@/trpc/server";
import Onboarding from "@/app/_components/Onboarding";
// import { Dashboard } from "@/app/dashboard/page";

export default async function Home() {
  return (
    // <HydrateClient>
    <>
      <Onboarding />
      <main>{/* <Dashboard /> */}</main>
    </>
    // </HydrateClient>
  );
}
