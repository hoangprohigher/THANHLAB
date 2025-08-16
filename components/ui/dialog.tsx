import React from "react";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => onOpenChange?.(false)}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
