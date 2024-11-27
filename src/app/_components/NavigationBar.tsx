import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

const NavigationBar = ({ isSignedIn }: { isSignedIn: boolean }) => {
  return (
    <nav className="px-8 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isSignedIn && <SidebarTrigger />}
          <span className="text-xl font-bold">Mannota</span>
        </div>
        <div>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <Button className="rounded-xl bg-[#5AA676] px-4 py-2 text-lg font-medium text-white">
              <SignInButton mode="modal" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
