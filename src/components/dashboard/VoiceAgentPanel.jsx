"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/card";
import { AlertTriangle, Loader2, Mic, PauseCircle, Waves } from "lucide-react";

const STATUS_LABELS = {
  idle: "Ready for your next voice question",
  listening: "Listening... share what's on your mind",
  processing: "Cooking up a response",
};

function formatQuota(quota) {
  if (!quota?.limit) return null;
  const used = Math.max(0, quota.limit - (quota.remaining ?? 0));
  return `${used}/${quota.limit} questions used today`;
}

export function VoiceAgentPanel({
  status = "idle",
  recording = false,
  processing = false,
  error = "",
  onStart,
  onStop,
  onDismissError,
  canRecord = true,
  quota,
}) {
  const quotaLabel = formatQuota(quota);
  const isListening = status === "listening";
  const isProcessing = processing || status === "processing";

  return (
    <Card className="border-cyan-500/20 bg-slate-950/60 backdrop-blur shadow-[0_22px_60px_-32px_rgba(14,165,233,0.45)]">
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-cyan-200/90">
            <Waves className={cn("h-4 w-4 transition", recording ? "animate-pulse" : "opacity-60")} />
            <span className="font-medium">
              {STATUS_LABELS[status] || STATUS_LABELS.idle}
            </span>
          </div>
          {quotaLabel && (
            <div className="text-xs uppercase tracking-wide text-cyan-200/60">
              {quotaLabel}
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <div>{error}</div>
                {onDismissError && (
                  <button
                    type="button"
                    onClick={onDismissError}
                    className="mt-1 text-[10px] uppercase tracking-wide text-amber-200/70 hover:text-amber-100"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row">
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          <Button
            type="button"
            variant={recording ? "destructive" : "default"}
            onClick={recording ? onStop : onStart}
            disabled={isProcessing || (!recording && !canRecord)}
            className={cn(
              "flex items-center gap-2 px-4 text-sm font-semibold",
              recording
                ? "bg-rose-500/90 hover:bg-rose-500 shadow-[0_25px_60px_-25px_rgba(244,63,94,0.55)]"
                : "bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 shadow-[0_20px_48px_-24px_rgba(34,211,238,0.65)]"
            )}
          >
            {recording ? (
              <>
                <PauseCircle className="h-4 w-4" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Voice Chat
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
