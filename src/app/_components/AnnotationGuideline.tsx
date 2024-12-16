import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { api } from "@/trpc/react"; // Updated to use TRPC
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Markdown from "react-markdown";

const AnnotationGuideline: React.FC = () => {
  const { data: guidelines, isLoading } =
    api.guideline.fetchGuidelines.useQuery();
  const [selectedGuideline, setSelectedGuideline] = useState<{
    longGuideline: string;
  } | null>(null);

  //   if (isLoading) {
  //     return (
  //       <div className="flex items-center justify-center">
  //         <LoadingSpinner />
  //       </div>
  //     );
  //   }

  return (
    <Card className="w-full rounded-none border-none bg-gray-100 shadow-none">
      <CardContent className="pt-4">
        <Label>Annotation Guideline</Label>
        {guidelines && guidelines.length > 0 && (
          <Markdown className="text-sm text-gray-700">
            {guidelines[0]?.shortGuideline}
          </Markdown>
        )}
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="mt-2"
                variant="outline"
                size="sm"
                onClick={() => setSelectedGuideline(guidelines?.[0] ?? null)}
              >
                View details <ArrowRight />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Markdown className="text-md text-gray-700">
                {selectedGuideline?.longGuideline}
              </Markdown>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnotationGuideline;
