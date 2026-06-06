interface HeaderProps {
  total: number
  filtered: number
}

export default function Header({ total, filtered }: HeaderProps) {
  return (
    <header className="bg-green-700 text-white px-4 py-5 shadow-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🏥</span>
          <h1 className="text-2xl font-bold tracking-tight">
            İstanbul Aile Sağlığı Merkezleri Haritası
          </h1>
        </div>
        <p className="text-green-100 text-sm mt-1 max-w-2xl">
          İstanbul genelindeki Aile Sağlığı Merkezlerini (ASM) ilçeye göre
          filtreleyin, konumlarını ve iletişim bilgilerini görüntüleyin.
          Veriler OpenStreetMap katkıcıları tarafından sağlanmaktadır.
        </p>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="bg-green-600 rounded-full px-3 py-1">
            📍 Toplam: <strong>{total}</strong> ASM
          </span>
          {filtered < total && (
            <span className="bg-green-500 rounded-full px-3 py-1">
              🔍 Gösterilen: <strong>{filtered}</strong>
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
