export function Spinner({ label = 'جارٍ التحميل…' }: { label?: string }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner__dot" />
      <span>{label}</span>
    </div>
  );
}
