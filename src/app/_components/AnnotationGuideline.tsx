import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AnnotationGuideline: React.FC = () => {
  const { data: guidelines } = api.guideline.fetchGuidelines.useQuery();
  const [selectedGuideline, setSelectedGuideline] = useState<{
    longGuideline: string;
  } | null>(null);

  return (
    <Card className="w-full rounded-none border-none bg-gray-100 shadow-none">
      <CardContent className="pt-4">
        <Label>Annotation Guideline</Label>
        {guidelines && guidelines.length > 0 && (
          <Markdown
            remarkPlugins={[remarkGfm]}
            className="text-sm text-gray-700"
          >
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
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <Markdown
                remarkPlugins={[remarkGfm]}
                className="text-md leading-relaxed text-gray-700"
                components={{
                  hr: ({ ...props }) => <hr className="my-2" {...props} />,
                }}
              >
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
