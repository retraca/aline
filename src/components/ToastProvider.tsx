"use client"
import React from 'react'

type Toast = { id: number; title: string; description?: string; variant?: 'success' | 'error' }

type ToastContextValue = {
  show: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const counter = React.useRef(1)

  const show = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = counter.current++
    const toast: Toast = { id, ...t }
    setToasts((arr) => [...arr, toast])
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[240px] rounded-md border p-3 shadow-lg ${
              t.variant === 'error'
                ? 'bg-red-900/40 border-red-700 text-red-100'
                : t.variant === 'success'
                ? 'bg-green-900/30 border-green-700 text-green-100'
                : 'bg-neutral-900/60 border-neutral-700 text-neutral-100'
            }`}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description ? <div className="text-sm opacity-90">{t.description}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}


