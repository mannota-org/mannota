import { SignedIn } from "@clerk/nextjs";
import AdminSettings from "../_components/AdminSettings";

const Settings = () => {
  return (
    <SignedIn>
      <AdminSettings />
    </SignedIn>
  );
};

export default Settings;