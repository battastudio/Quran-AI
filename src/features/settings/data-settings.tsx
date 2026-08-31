import { useRef } from 'react';
import { exportData, importData, resetAll } from '../../lib/db';

export function DataSettings() {
  const fileRef = useRef<HTMLInputElement>(null);

  async function doExport() {
    const data = await exportData();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nour-al-quran-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doImport(file: File) {
    try {
      await importData(JSON.parse(await file.text()));
      location.reload();
    } catch {
      alert('ملف غير صالح.');
    }
  }

  async function doReset() {
    if (!confirm('حذف كل البيانات والتنزيلات؟ لا يمكن التراجع.')) return;
    await resetAll();
    location.reload();
  }

  return (
    <div className="stack">
      <button className="btn btn--sm" onClick={doExport}>تصدير التقدّم (JSON)</button>
      <button className="btn btn--sm" onClick={() => fileRef.current?.click()}>استيراد التقدّم</button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        hidden
        onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])}
      />
      <button className="btn btn--sm btn--danger" onClick={doReset}>إعادة ضبط التطبيق</button>
    </div>
  );
}
