import { SignedIn } from "@clerk/nextjs";
import Header from "./Header";

const AdminSettings = () => {
  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden">
      <Header title="Admin Settings" />
    </div>
  );
};

export default AdminSettings;
