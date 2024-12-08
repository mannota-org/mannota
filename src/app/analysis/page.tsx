import { SignedIn } from "@clerk/nextjs";
import PScoreVisualization from "@/app/_components/PScoreVisualization";

const Analysis = () => {
  return (
    <SignedIn>
      <PScoreVisualization />
    </SignedIn>
  );
};

export default Analysis;
