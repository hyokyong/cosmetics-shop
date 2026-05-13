"use client"

import * as React from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 3000

type ToasterToast = ToastProps

let count = 0
const genId = () => { count = (count + 1) % Number.MAX_SAFE_INTEGER; return count.toString() }

type State = { toasts: ToasterToast[] }
const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(toasts: ToasterToast[]) {
  memoryState = { toasts }
  listeners.forEach((l) => l(memoryState))
}

function toast({ title, description, variant = 'default' }: Omit<ToasterToast, 'id'>) {
  const id = genId()
  const newToast: ToasterToast = { id, title, description, variant, open: true }
  const newToasts = [newToast, ...memoryState.toasts].slice(0, TOAST_LIMIT)
  dispatch(newToasts)
  setTimeout(() => {
    dispatch(memoryState.toasts.filter((t) => t.id !== id))
  }, TOAST_REMOVE_DELAY)
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => { const i = listeners.indexOf(setState); if (i > -1) listeners.splice(i, 1) }
  }, [])
  return { toasts: state.toasts, toast }
}

export { useToast, toast }
