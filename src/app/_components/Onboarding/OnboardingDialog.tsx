"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoleCombobox } from "@/app/_components/Onboarding/Combobox";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

export const OnboardingDialog = () => {
  const [role, setRole] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false); // Start with dialog closed

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const fullName = user?.fullName || "";
  const { toast } = useToast();

  // Check if the user exists
  const { data: userExists, isSuccess } = api.user.checkUserExists.useQuery(
    { email },
    {
      enabled: !!email, // Only run the query if there is an email
    },
  );

  // Use effect to handle the query success
  useEffect(() => {
    if (isSuccess) {
      if (!userExists) {
        setIsOpen(true); // Open dialog if user does not exist
      } else {
        console.log("User already exists, not displaying dialog.");
      }
    }
  }, [isSuccess, userExists]);

  const checkAndCreateUserMutation = api.user.checkAndCreateUser.useMutation({
    onSuccess: (data) => {
      if (data) {
        setIsOpen(false);
        toast({
          title: "Success",
          description: "User created successfully",
        });
        console.log("User created:", data);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Error creating user",
      });
      console.error("Error creating user:", error);
    },
  });

  const handleSave = async () => {
    if (!email || !fullName || !role) {
      console.error("All fields are required");
      return;
    }

    try {
      await checkAndCreateUserMutation.mutateAsync({
        email,
        fullName,
        role,
      });
    } catch (error) {
      console.error("Error during mutation execution:", error);
    }
  };

  // Only render the dialog if isOpen is true
  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Complete Onboarding</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>
            Select your role to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RoleCombobox onSelect={setRole} />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
};
