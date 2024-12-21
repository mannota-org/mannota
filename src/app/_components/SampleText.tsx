import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SampleTextProps {
  medicalText: string;
  task: string;
  confidence: number;
  batchIndex: number;
  confidenceThreshold: number;
  dataPerBatch: number;
}

const SampleText: React.FC<SampleTextProps> = ({
  medicalText,
  task,
  confidence,
  batchIndex,
  confidenceThreshold,
  dataPerBatch,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label>Sample Text</Label>
        <Textarea
          value={medicalText ?? "N/A"}
          readOnly
          className="h-20 bg-gray-50 text-gray-800"
          disabled
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-1 lg:grid-cols-5">
          <Badge
            variant="outline"
            className="rounded-full border-orange-200 bg-yellow-50 text-sm text-orange-500"
          >
            Task: {task ?? "N/A"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-red-200 bg-red-50 text-sm text-red-500"
          >
            CScore: {confidence?.toFixed(1) ?? "N/A"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-purple-200 bg-purple-50 text-sm text-purple-600"
          >
            Batch: {batchIndex ?? "N/A"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-pink-200 bg-pink-50 text-sm text-pink-600"
          >
            Threshold: {confidenceThreshold?.toFixed(1) ?? "N/A"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-blue-200 bg-blue-50 text-sm text-blue-600"
          >
            DPB: {dataPerBatch ?? "N/A"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default SampleText;
