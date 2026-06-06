import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ASM } from '../types/asm'

// Leaflet'in default icon path sorunu çözümü
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const greenIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;background:#16a34a;border:3px solid white;
    border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    box-shadow:0 2px 6px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
})

function buildPopup(asm: ASM): string {
  const addressLine = asm.address
    ? `<p style="margin:2px 0;color:#555;font-size:12px">📍 ${asm.address}</p>`
    : ''
  const phoneLine = asm.phone
    ? `<p style="margin:2px 0;color:#555;font-size:12px">📞 <a href="tel:${asm.phone}" style="color:#16a34a">${asm.phone}</a></p>`
    : ''
  const mediaLine = asm.media
    ? `<img src="${asm.media}" alt="${asm.name}"
         style="width:100%;max-height:120px;object-fit:cover;border-radius:6px;margin-top:8px"
         onerror="this.style.display='none'">`
    : ''

  return `
    <div style="min-width:200px;max-width:260px;font-family:sans-serif">
      <h3 style="margin:0 0 4px;font-size:14px;font-weight:700;color:#15803d">${asm.name}</h3>
      <span style="display:inline-block;background:#dcfce7;color:#166534;border-radius:4px;
                   padding:1px 6px;font-size:11px;margin-bottom:6px">${asm.district || 'İstanbul'}</span>
      ${addressLine}
      ${phoneLine}
      ${mediaLine}
    </div>
  `
}

interface MapViewProps {
  data: ASM[]
}

export default function MapView({ data }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  // Haritayı bir kez başlat
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    const map = L.map(mapContainerRef.current, {
      center: [41.015, 28.98],
      zoom: 11,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları',
      maxZoom: 19,
    }).addTo(map)
    layerGroupRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Veri değişince markerları güncelle
  useEffect(() => {
    const lg = layerGroupRef.current
    if (!lg) return
    lg.clearLayers()
    data.forEach((asm) => {
      if (!asm.latitude || !asm.longitude) return
      L.marker([asm.latitude, asm.longitude], { icon: greenIcon })
        .bindTooltip(asm.name, { permanent: false, direction: 'top', offset: [0, -30] })
        .bindPopup(buildPopup(asm), { maxWidth: 280 })
        .addTo(lg)
    })
    // Filtre uygulandıysa sınıra zoom at
    if (data.length > 0 && data.length < 50 && mapRef.current) {
      const bounds = L.latLngBounds(data.map((a) => [a.latitude, a.longitude]))
      mapRef.current.fitBounds(bounds, { padding: [40, 40] })
    } else if (data.length >= 50 && mapRef.current) {
      mapRef.current.setView([41.015, 28.98], 11)
    }
  }, [data])

  return (
    <div
      ref={mapContainerRef}
      className="flex-1 w-full"
      style={{ minHeight: 'calc(100vh - 130px)' }}
    />
  )
}
