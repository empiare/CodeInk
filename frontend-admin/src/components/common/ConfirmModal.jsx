import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title, message, confirmText, cancelText, danger, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700/50 shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
            danger ? 'bg-red-50 dark:bg-red-500/10' : 'bg-amber-50 dark:bg-amber-500/10'
          }`}>
            <AlertTriangle size={22} className={danger ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-1.5">{title}</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 border border-stone-200/70 dark:border-stone-700/50 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            {cancelText || '取消'}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl cursor-pointer transition-all ${
              danger
                ? 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 shadow-sm'
                : 'bg-amber-600 dark:bg-amber-500 text-white hover:bg-amber-700 dark:hover:bg-amber-600 shadow-sm'
            }`}
          >
            {confirmText || '确定'}
          </button>
        </div>
      </div>
    </div>
  );
}
