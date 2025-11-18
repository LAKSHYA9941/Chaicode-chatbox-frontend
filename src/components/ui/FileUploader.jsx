"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { FileIcon, UploadCloud } from "lucide-react";

const ACCEPTED = [".vtt"]; // default; caller can override via props

export function FileUploader({
  label = "Upload files",
  description = "Drag & drop or click to select",
  accept = ACCEPTED,
  multiple = true,
  disabled = false,
  files = [],
  onChange,
  onRemove,
  maxFiles,
}) {
  const inputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const acceptAttr = useMemo(() => {
    if (!accept || accept.length === 0) return undefined;
    return accept.join(",");
  }, [accept]);

  const handleSelect = useCallback(
    (fileList) => {
      if (!onChange) return;
      let selected = Array.from(fileList);
      if (maxFiles) {
        selected = selected.slice(0, maxFiles);
      }
      onChange(selected);
    },
    [maxFiles, onChange]
  );

  const handleInputChange = useCallback(
    (event) => {
      handleSelect(event.target.files ?? []);
    },
    [handleSelect]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setIsDragActive(false);
      handleSelect(event.dataTransfer.files ?? []);
    },
    [disabled, handleSelect]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const totalSize = useMemo(() => files.reduce((sum, file) => sum + (file.size || 0), 0), [files]);

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileDialog();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/20 bg-black/30 px-6 py-8 text-center transition",
          disabled && "cursor-not-allowed opacity-60",
          isDragActive && "border-emerald-400/80 bg-emerald-400/10"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
          accept={acceptAttr}
          multiple={multiple}
          disabled={disabled}
        />
        <UploadCloud className="h-8 w-8 text-white/70" />
        <div className="space-y-1">
          <div className="text-sm font-medium text-white">{label}</div>
          <div className="text-xs text-white/60">{description}</div>
        </div>
        <div className="text-[11px] uppercase tracking-wider text-white/50">
          {acceptAttr ? `Accepted: ${acceptAttr}` : "Any files"}
        </div>
      </div>

      {files.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-black/20 text-xs">
          <div className="flex items-center justify-between px-3 py-2 text-white">
            <span className="font-semibold uppercase tracking-wide">Selected Files</span>
            <span>{files.length} · {(totalSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="max-h-48 divide-y divide-white/5 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 px-3 py-2 text-white/90"
              >
                <div className="flex flex-1 items-center gap-2 overflow-hidden text-left">
                  <FileIcon className="h-4 w-4 shrink-0 text-white/40" />
                  <span className="truncate" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-white/60">{(file.size / 1024).toFixed(1)} KB</span>
                  {onRemove && (
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-wide text-rose-300/80 hover:text-rose-200"
                      onClick={() => onRemove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
