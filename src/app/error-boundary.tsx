import { Component, type ReactNode } from 'react';
import { resetAll } from '../lib/db';

interface State { error: Error | null }

// Top-level crash safety: any render error shows a friendly fallback instead of
// a blank white screen, with reload + reset-for-recovery.
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash">
        <h1>حدث خطأ غير متوقّع</h1>
        <p className="field__hint">نعتذر — أعد تحميل التطبيق للمتابعة.</p>
        <button className="btn" onClick={() => location.reload()}>إعادة التحميل</button>
        <button className="link" onClick={async () => { await resetAll(); location.reload(); }}>
          إعادة الضبط (يمسح البيانات المحفوظة)
        </button>
      </div>
    );
  }
}
