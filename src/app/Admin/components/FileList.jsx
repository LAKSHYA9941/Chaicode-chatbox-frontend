export function FileList({ files }) {
  if (!files || files.length === 0) return null;

  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

  return (
    <div className="rounded border border-white/10 bg-black/20 text-xs divide-y divide-white/5">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="font-semibold uppercase tracking-wide">Files Selected</span>
        <span>
          {files.length} files · {(totalSize / 1024 / 1024).toFixed(2)} MB
        </span>
      </div>
      <div className="max-h-40 overflow-y-auto">
        {files.map((file, idx) => (
          <div key={`${file.name}-${idx}`} className="flex items-center justify-between px-3 py-1 text-[11px]">
            <span className="truncate mr-2" title={file.name}>
              {file.name}
            </span>
            <span className="text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        ))}
      </div>
    </div>
  );
}
