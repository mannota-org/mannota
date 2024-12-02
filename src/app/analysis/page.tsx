import { SignedIn } from "@clerk/nextjs";
import PScoreVisualization from "../_components/PScoreVisualization";

const Dashboard = () => {
  return (
    <SignedIn>
      <PScoreVisualization/>
    </SignedIn>
  );
};

export default Dashboard;
