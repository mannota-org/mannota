"use client";
import { SignedIn, useUser } from "@clerk/nextjs";
import AdminSettings from "../_components/AdminSettings";
import { notFound } from "next/navigation";
import { api } from "@/trpc/react";

const Settings = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const { data: userData, isLoading } = api.user.getUserByEmail.useQuery(
    { email },
    {
      enabled: !!email,
    },
  );

  if (isLoading) return null;
  if (
    !userData ||
    (!userData.isAdmin && userData.role?.toLowerCase() !== "admin")
  ) {
    return notFound();
  }

  return (
    <SignedIn>
      <AdminSettings />
    </SignedIn>
  );
};

export default Settings;