import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/dashboard"); // Redirects to the /dashboard route
  return null; 
}
