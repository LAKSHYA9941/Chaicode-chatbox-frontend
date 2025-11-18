import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { CourseForm } from "./CourseForm";
import { CourseList } from "./CourseList";

export function CoursesTab({ courses, submitting, onCreate, onDelete }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Course</CardTitle>
          <CardDescription>Define a course and its Qdrant collection</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm onSubmit={onCreate} submitting={submitting} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Courses</CardTitle>
          <CardDescription>Manage active courses</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseList courses={courses} submitting={submitting} onDelete={onDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
