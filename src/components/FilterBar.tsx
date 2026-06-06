interface FilterBarProps {
  districts: string[]
  selected: string
  onChange: (district: string) => void
}

export default function FilterBar({ districts, selected, onChange }: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
        <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">
          İlçeye göre filtrele:
        </label>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
        >
          <option value="">Tüm İlçeler</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {selected && (
          <button
            onClick={() => onChange('')}
            className="text-sm text-red-500 hover:text-red-700 underline"
          >
            Filtreyi temizle
          </button>
        )}
      </div>
    </div>
  )
}
