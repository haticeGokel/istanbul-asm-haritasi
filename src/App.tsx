import { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import MapView from './components/MapView'
import { useASMData } from './hooks/useASMData'

export default function App() {
  const { data, loading, error } = useASMData()
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const districts = useMemo(() => {
    const set = new Set(data.map((a) => a.district).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'tr'))
  }, [data])

  const filtered = useMemo(
    () =>
      selectedDistrict
        ? data.filter((a) => a.district === selectedDistrict)
        : data,
    [data, selectedDistrict]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🏥</div>
          <p className="text-green-700 font-semibold text-lg">
            ASM verileri yükleniyor…
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Hata: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Header total={data.length} filtered={filtered.length} />
      <FilterBar
        districts={districts}
        selected={selectedDistrict}
        onChange={setSelectedDistrict}
      />
      <MapView data={filtered} />
    </div>
  )
}
