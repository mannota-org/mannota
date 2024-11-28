import AnnotationDashboard from "../_components/Dashboard";
import { SignedIn } from "@clerk/nextjs";

const Dashboard = () => {
  return (
    <SignedIn>
      <AnnotationDashboard />
    </SignedIn>
  );
};

export default Dashboard;
