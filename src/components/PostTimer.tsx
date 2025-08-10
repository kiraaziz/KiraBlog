"use client"

import { useEffect, useRef } from "react"
import { incrementPostTotalTimeRead } from "@/utils/hooks/usePosts"

type PostTimerProps = {
  postId: number
}

export default function PostTimer({ postId }: PostTimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!postId) return

    intervalRef.current = setInterval(() => {
      incrementPostTotalTimeRead(postId, 20)
    }, 20000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [postId])

  return null
}
