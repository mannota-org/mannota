import { SignInButton, SignUpButton } from "@clerk/nextjs";

const NavigationBar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-xl font-bold">VSExam</span>
        <SignInButton mode="modal">
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    </nav>
  );
};

export default NavigationBar;
