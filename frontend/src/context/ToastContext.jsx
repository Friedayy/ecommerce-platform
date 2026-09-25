import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, ExternalLink } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'success', title, message, image, action, duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message, image, action };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex items-start gap-3 transition-all duration-300 transform translate-y-0"
          >
            {/* Image or Icon */}
            {toast.image ? (
              <img
                src={toast.image}
                alt=""
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100"
              />
            ) : (
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500" />}
                {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
              </div>
            )}

            {/* Message Body */}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {toast.title}
                </p>
              )}
              {toast.message && (
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>
              )}

              {/* Action Button */}
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                >
                  {toast.action.label}
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition -mr-1 -mt-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
