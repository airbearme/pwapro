"use client"

import { useEffect, useRef } from "react"
import { useAuthContext } from "@/components/auth-provider"
import type { AirbearLocation } from "@/lib/supabase/realtime"

interface NotificationState {
  permission: NotificationPermission
  isSupported: boolean
}

/**
 * Hook to send push notifications when airbears become available
 */
export function useAirbearNotifications(airbears: AirbearLocation[]) {
  const { user } = useAuthContext()
  const previousAvailableCountRef = useRef<number>(0)
  const notificationStateRef = useRef<NotificationState>({
    permission: "default",
    isSupported: typeof window !== "undefined" && "Notification" in window,
  })

  useEffect(() => {
    if (!user || !notificationStateRef.current.isSupported) {
      return
    }

    // Request notification permission if not already granted
    if (notificationStateRef.current.permission === "default") {
      Notification.requestPermission().then((permission) => {
        notificationStateRef.current.permission = permission
      })
    }

    // Calculate current available airbears
    const availableCount = airbears.filter(
      (a) => a.is_available && !a.is_charging
    ).length

    const previousCount = previousAvailableCountRef.current

    // If airbears became available (went from 0 to >0, or increased)
    if (previousCount === 0 && availableCount > 0) {
      if (
        notificationStateRef.current.permission === "granted" &&
        document.hidden
      ) {
        new Notification("AirBear Available! 🐻", {
          body: `${availableCount} AirBear${availableCount > 1 ? "s" : ""} ${availableCount > 1 ? "are" : "is"} now available in Binghamton!`,
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
          tag: "airbear-available",
          requireInteraction: false,
        })
      }
    } else if (previousCount > 0 && availableCount > previousCount) {
      // More airbears became available
      if (
        notificationStateRef.current.permission === "granted" &&
        document.hidden
      ) {
        new Notification("More AirBears Available! 🐻", {
          body: `${availableCount - previousCount} more AirBear${availableCount - previousCount > 1 ? "s" : ""} ${availableCount - previousCount > 1 ? "are" : "is"} now available!`,
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
          tag: "airbear-available",
          requireInteraction: false,
        })
      }
    }

    previousAvailableCountRef.current = availableCount
  }, [airbears, user])

  return {
    permission: notificationStateRef.current.permission,
    isSupported: notificationStateRef.current.isSupported,
  }
}
