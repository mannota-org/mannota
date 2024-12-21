import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, Pause, Play, Send, ArrowUpRight } from "lucide-react";
import { formatTime } from "@/lib/helpers";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/trpc/react";

interface AnnotationTextProps {
  editableText: string;
  setEditableText: (text: string) => void;
  annotateReason: string;
  setAnnotateReason: (reason: string) => void;
  isRunning: boolean;
  isPaused: boolean;
  isSubmitting: boolean;
  seconds: number;
  textLeftToAnnotate: number;
  totalTextInBatch: number;
  handleStartPauseResume: () => void;
  handleSubmit: () => void;
}

const AnnotationText: React.FC<AnnotationTextProps> = ({
  editableText,
  setEditableText,
  annotateReason,
  setAnnotateReason,
  isRunning,
  isPaused,
  isSubmitting,
  seconds,
  textLeftToAnnotate,
  totalTextInBatch,
  handleStartPauseResume,
  handleSubmit,
}) => {
  const { data: guidelines } = api.guideline.fetchGuidelines.useQuery();
  const [selectedGuideline, setSelectedGuideline] = useState<{
    longGuideline: string;
  } | null>(null);

  const clockTextColor = isPaused
    ? "text-red-500"
    : isRunning
      ? "text-primary-800"
      : "text-gray-700";

  return (
    <div className="mt-4 space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="annotate-text">Annotate Text</Label>
        <Textarea
          id="annotate-text"
          value={editableText || ""}
          onChange={(e) => setEditableText(e.target.value)}
          disabled={!isRunning || isPaused}
          className="h-20"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="annotate-reason">Annotate Reason</Label>
        <Input
          id="annotate-reason"
          value={annotateReason || ""}
          onChange={(e) => setAnnotateReason(e.target.value)}
          placeholder="Give your reason for annotating"
          disabled={!isRunning || isPaused || isSubmitting}
        />
      </div>
      <div className="flex grid grid-cols-1 flex-wrap gap-2 sm:grid-cols-1 lg:grid-cols-5">
        <Button
          onClick={handleStartPauseResume}
          disabled={isSubmitting}
          className="flex-1 bg-primary-800"
        >
          {!isRunning ? <Play /> : isPaused ? <Play /> : <Pause />}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isRunning || isSubmitting}
          className="flex-1 bg-primary-800"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
        <Badge variant="outline" className={`flex-1 text-sm ${clockTextColor}`}>
          <Clock className="mr-2 h-4 w-4" />
          {formatTime(seconds)}
        </Badge>
        <Badge variant="outline" className="flex-1 text-sm font-normal">
          <span className="font-bold">{textLeftToAnnotate ?? "N/A"}</span>/
          {totalTextInBatch ?? "N/A"} text(s) left
        </Badge>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="flex-1 bg-green-50 text-primary-800"
              variant="outline"
              onClick={() => setSelectedGuideline(guidelines?.[0] ?? null)}
            >
              Full Guideline <ArrowUpRight />
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
      <hr className="mb-6 mt-12" />
      <div>
        <Label>Annotation Guideline</Label>
        {guidelines && guidelines.length > 0 && (
          <Markdown
            remarkPlugins={[remarkGfm]}
            className="text-sm text-gray-700"
          >
            {guidelines[0]?.shortGuideline}
          </Markdown>
        )}
      </div>
    </div>
  );
};

export default AnnotationText;
