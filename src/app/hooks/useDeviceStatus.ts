import { useEffect, useState } from 'react'

export function useDeviceStatus(deviceId?: string) {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId) {
      setStatus('unknown')
      setError('Missing deviceId')
      return
    }

    let isMounted = true
    setError(null) // reset error setiap deviceId baru

    async function fetchStatus() {
      try {
        setLoading(true)
        const res = await fetch(`/api/devices/deviceStatus/${deviceId}`)
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || `HTTP error: ${res.status}`)
        }

        const data = await res.json()
        if (!isMounted) return

        if (data.lastLog?.event === 'connected' || data.lastLog?.event === 'disconnected') {
          setStatus(data.lastLog.event)
          setError(null)
        } else {
          setStatus('unknown')
          setError(null)
        }
      } catch (err: any) {
        if (!isMounted) return
        setStatus('unknown')
        setError(err.message || 'Error fetching status')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 10000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [deviceId])

  return { status, loading, error }
}
