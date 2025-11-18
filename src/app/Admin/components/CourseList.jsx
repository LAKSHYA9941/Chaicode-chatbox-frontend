import { Button } from "../../../components/ui/Button";

export function CourseList({ courses, submitting, onDelete }) {
  if (!courses || courses.length === 0) {
    return <div className="text-sm text-muted-foreground">No courses yet.</div>;
  }

  return (
    <div className="space-y-2">
      {courses.map((course) => (
        <div key={course.courseId} className="flex items-center justify-between border rounded p-2">
          <div className="space-y-1">
            <div className="font-medium">
              {course.name}{" "}
              <span className="text-xs text-muted-foreground">({course.courseId})</span>
            </div>
            {course.description && (
              <div className="text-xs text-muted-foreground line-clamp-2">{course.description}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              disabled={submitting}
              onClick={() => onDelete?.(course.courseId)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
