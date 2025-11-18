import { Button } from "../../../components/ui/Button";

export function GuardMessage({ title, description, actionLabel, onAction }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
      </div>
      {actionLabel && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
