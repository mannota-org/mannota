import "@/styles/globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import NavigationBar from "./_components/NavigationBar";
import { LandingPage } from "./_components/LandingPage";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/_components/AppSidebar";

// Import Inter font from Google Fonts
import { Inter } from "next/font/google";

// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mannota",
  description:
    "Mannota is a Medical Text Annotation tool for experts and students",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.className} h-full`}>
        <body className="h-full">
          <SignedIn>
            <TRPCReactProvider>
              <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                  <AppSidebar />
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <NavigationBar isSignedIn={true} />
                    <main className="flex-1 overflow-auto bg-gray-50 p-4">
                      <div className="mx-auto w-full max-w-7xl">{children}</div>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
              <Toaster />
            </TRPCReactProvider>
          </SignedIn>
          <SignedOut>
            <div className="flex h-screen w-full flex-col">
              <NavigationBar isSignedIn={false} />
              <LandingPage />
            </div>
          </SignedOut>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
