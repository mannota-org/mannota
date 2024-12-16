"use client";
import { SignedIn, useUser } from "@clerk/nextjs";
import AdminSettings from "../_components/AdminSettings";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);

  const { data: userData, isLoading } = api.user.getUserByEmail.useQuery(
    { email },
    {
      enabled: !!email,
    },
  );

  if (isLoading) return null;

  const isAdmin =
    userData?.isAdmin ?? userData?.role?.toLowerCase() === "admin";

  if (!isAdmin) {
    return (
      <SignedIn>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogTitle>Access Denied</DialogTitle>
            <DialogDescription>
              Please contact your admin for settings configuration.
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => router.push("/dashboard")}>
                Back to Home
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {!showModal && (
          <div className="flex h-screen flex-col items-center justify-center">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold">Access Denied 🔒</h2>
              <p className="text-gray-600">
                Please contact your admin for settings configuration.
              </p>
            </div>
            <Button className="mt-6" onClick={() => router.push("/dashboard")}>
              Back to Home
            </Button>
          </div>
        )}
      </SignedIn>
    );
  }

  return (
    <SignedIn>
      <AdminSettings />
    </SignedIn>
  );
};

export default Settings;
