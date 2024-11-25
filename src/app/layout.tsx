import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import NavigationBar from "./_components/NavigationBar";
import { LandingPage } from "./_components/LandingPage";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "VSExam",
  description: "VSExam is an exam management system for teachers.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} h-full`}>
        <body className="h-full">
          <SignedIn>
            <TRPCReactProvider>
              <UserButton />
              {children}
              {/* Commented out components that are not yet used */}
              {/* <SidebarProvider> */}
              {/*   <div className="flex h-screen w-full overflow-hidden"> */}
              {/*     <AppSidebar /> */}
              {/*     <div className="flex flex-1 flex-col overflow-hidden"> */}
              {/*       <nav className="bg-gray-800 p-4 text-white"> */}
              {/*         <div className="container mx-auto flex items-center justify-between"> */}
              {/*           <div className="flex items-center"> */}
              {/*             <SidebarTrigger /> */}
              {/*             <span className="ml-4 text-xl font-bold">VsExam</span> */}
              {/*           </div> */}
              {/*         </div> */}
              {/*       </nav> */}
              {/*       <main className="flex-1 overflow-auto bg-gray-100 p-4"> */}
              {/*         <div className="mx-auto w-full max-w-7xl">{children}</div> */}
              {/*       </main> */}
              {/*     </div> */}
              {/*   </div> */}
              {/*   <Toaster /> */}
              {/* </SidebarProvider> */}
            </TRPCReactProvider>
          </SignedIn>
          <SignedOut>
            <div className="flex h-screen w-full flex-col">
              <NavigationBar />
              <LandingPage />
            </div>
          </SignedOut>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
