// This is a simplified version - in production, use a proper toast library like sonner or react-hot-toast
import { useState, useCallback } from "react"

type ToastProps = {
    title: string
    description?: string
    variant?: "default" | "destructive"
    duration?: number
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const toast = useCallback(({ title, description, variant = "default", duration = 3000 }: ToastProps) => {
        const id = Math.random().toString(36).substr(2, 9)

        // In a real implementation, this would show a toast notification
        console.log(`[Toast] ${variant}: ${title} - ${description}`)

        // Auto dismiss
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.title !== title))
        }, duration)
    }, [])

    return { toast, toasts }
}