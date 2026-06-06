import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import type { ASM } from '../types/asm'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHidQNrpF072SsZNPLNwQytcIK_1la6qhp4sl2tkxC5uYeEOSzMHzuRwrnIn3j2UJM3WTB68qEqLqk/pub?gid=0&single=true&output=csv'

export function useASMData() {
  const [data, setData] = useState<ASM[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Papa.parse<ASM>(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const valid = results.data.filter(
          (r) => r.latitude && r.longitude && r.name
        )
        setData(valid)
        setLoading(false)
      },
      error: (err) => {
        setError(err.message)
        setLoading(false)
      },
    })
  }, [])

  return { data, loading, error }
}
