("use client");
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const Onboarding: React.FC = () => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || "No email found";
      const fullName = user.fullName || "No name found";
      console.log("Email:", email);
      console.log("Full Name:", fullName);
    } else {
      console.log("User is not signed in.");
    }
  }, [isSignedIn, user]);

  return null;
};

export default Onboarding;
