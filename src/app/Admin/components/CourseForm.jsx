import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { FloatingInput as Input } from "../../../components/ui/Input";

export function CourseForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({ courseId: "", name: "", iconUrl: "", description: "" });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(form, () => setForm({ courseId: "", name: "", iconUrl: "", description: "" }));
  };

  return (
    <div className="space-y-3">
      <Input label="Course ID" value={form.courseId} onChange={(e) => handleChange("courseId", e.target.value)} />
      <Input label="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
      <Input label="Icon URL (optional)" value={form.iconUrl} onChange={(e) => handleChange("iconUrl", e.target.value)} />
      <Input label="Description (optional)" value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
      <Button disabled={submitting} onClick={handleSubmit} className="w-full md:w-auto">
        {submitting ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}
