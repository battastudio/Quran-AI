import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: Props) {
  if (!open) return null;
  return (
    <div className="sheet__backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sheet__grip" />
        {title && <h2 className="sheet__title">{title}</h2>}
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}
