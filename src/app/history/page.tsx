import { SignedIn } from "@clerk/nextjs";
import AnnotationHistory from "@/app/_components/AnnotationHistory";

const History = () => {
  return (
    <SignedIn>
      <AnnotationHistory />
    </SignedIn>
  );
};

export default History;
