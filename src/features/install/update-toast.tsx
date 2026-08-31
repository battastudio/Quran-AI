import { useRegisterSW } from 'virtual:pwa-register/react';

// Registers the service worker and surfaces offline-ready / update-available.
export function UpdateToast() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="toast">
      {needRefresh ? (
        <>
          <span>تحديث متوفّر</span>
          <button className="btn btn--sm" onClick={() => void updateServiceWorker(true)}>تحديث ↻</button>
        </>
      ) : (
        <span>التطبيق جاهز للعمل دون إنترنت ✓</span>
      )}
      <button className="icon-btn" aria-label="إغلاق" onClick={() => { setOfflineReady(false); setNeedRefresh(false); }}>✕</button>
    </div>
  );
}
