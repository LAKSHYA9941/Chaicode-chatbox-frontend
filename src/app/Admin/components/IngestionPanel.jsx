import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/Button";
import { FileUploader } from "../../../components/ui/FileUploader";

export function IngestionPanel({
  courses,
  selectedCourseId,
  onSelectCourse,
  onFilesSelected,
  files,
  forceRecreate,
  onToggleForceRecreate,
  onSubmit,
  submitting,
  ingestInfo,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingest Subtitles (.vtt)</CardTitle>
        <CardDescription>Upload one or more .vtt files for a selected course</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <select
              className="w-full rounded border bg-transparent p-2"
              value={selectedCourseId}
              onChange={(e) => onSelectCourse?.(e.target.value)}
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.name} ({course.courseId})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle files (.vtt)</label>
            <FileUploader
              label="Drag & drop .vtt files"
              description="or click to browse"
              accept={[".vtt"]}
              multiple
              files={files}
              onChange={onFilesSelected}
              disabled={submitting}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={forceRecreate}
            onChange={(e) => onToggleForceRecreate?.(e.target.checked)}
          />
          Recreate Qdrant collection before ingestion (drops existing vectors)
        </label>
        {ingestInfo && (
          <div className="rounded border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs">
            <div className="font-semibold text-emerald-300">{ingestInfo.message}</div>
            <div className="mt-1 grid gap-1 text-emerald-200/80 sm:grid-cols-2">
              <div>Files processed: {ingestInfo.processedFiles}/{ingestInfo.totalFiles}</div>
              <div>Chunks ingested: {ingestInfo.upserted}</div>
              <div className="sm:col-span-2">Recreated collection: {ingestInfo.forceRecreate ? "Yes" : "No"}</div>
            </div>
          </div>
        )}
        <Button disabled={submitting} onClick={onSubmit}>
          {submitting ? "Uploading & Processing…" : "Start Ingestion"}
        </Button>
      </CardContent>
    </Card>
  );
}
