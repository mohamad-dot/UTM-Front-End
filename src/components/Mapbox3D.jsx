import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { api, toBboxString } from '../api'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function Mapbox3D() {
  const mapRef = useRef(null)
  const refreshRef = useRef(null)
  const togglesRef = useRef({
    showZones: true,
    showNotams: true,
    showSpoor: true,
    showLandings: true,
  })

  const [showZones, setShowZones] = useState(true)
  const [showNotams, setShowNotams] = useState(true)
  const [showSpoor, setShowSpoor] = useState(true)
  const [showLandings, setShowLandings] = useState(true)

  // Helper: add or update a GeoJSON source
  function setGeoJsonSource(map, id, data) {
    const src = map.getSource(id)
    if (src) {
      src.setData(data)
    } else {
      map.addSource(id, { type: 'geojson', data })
    }
  }

  // Helper: ensure line / fill / circle layers exist
  function ensureLayers(map) {
    // Zones (fill + outline)
    if (!map.getLayer('zones-fill')) {
      map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'zones',
        paint: {
          'fill-color': '#ff0000',
          'fill-opacity': 0.25,
        },
      })
    }
    if (!map.getLayer('zones-outline')) {
      map.addLayer({
        id: 'zones-outline',
        type: 'line',
        source: 'zones',
        paint: {
          'line-color': '#ff0000',
          'line-width': 1,
        },
      })
    }

    // NOTAMs (fill + outline)
    if (!map.getLayer('notams-fill')) {
      map.addLayer({
        id: 'notams-fill',
        type: 'fill',
        source: 'notams',
        paint: {
          'fill-color': '#ff9900',
          'fill-opacity': 0.25,
        },
      })
    }
    if (!map.getLayer('notams-outline')) {
      map.addLayer({
        id: 'notams-outline',
        type: 'line',
        source: 'notams',
        paint: {
          'line-color': '#ff9900',
          'line-width': 1,
        },
      })
    }

    // DFP spoor (line)
    if (!map.getLayer('dfp-spoor')) {
      map.addLayer({
        id: 'dfp-spoor',
        type: 'line',
        source: 'dfp-spoor',
        paint: {
          'line-color': '#00ffff',
          'line-width': 2,
        },
      })
    }

    // DFP landingsites (circle)
    if (!map.getLayer('dfp-landings')) {
      map.addLayer({
        id: 'dfp-landings',
        type: 'circle',
        source: 'dfp-landings',
        paint: {
          'circle-radius': 4,
          'circle-color': '#00ff99',
          'circle-stroke-color': '#003322',
          'circle-stroke-width': 1,
        },
      })
    }
  }

  // Main refresh logic: fetch from backend + update layers
  async function refreshLayers() {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    const bounds = map.getBounds()
    const bbox = toBboxString(bounds)
    const { showZones, showNotams, showSpoor, showLandings } = togglesRef.current

    console.log('Refreshing layers with bbox:', bbox, togglesRef.current)

    // ZONES
    if (showZones) {
      try {
        const gj = await api.zones(bbox)
        console.log('Zones features:', gj?.features?.length || 0)
        setGeoJsonSource(map, 'zones', gj)
        ensureLayers(map)
        map.setLayoutProperty('zones-fill', 'visibility', 'visible')
        map.setLayoutProperty('zones-outline', 'visibility', 'visible')
      } catch (e) {
        console.error('Zones load failed', e)
      }
    } else if (map.getLayer('zones-fill')) {
      map.setLayoutProperty('zones-fill', 'visibility', 'none')
      map.setLayoutProperty('zones-outline', 'visibility', 'none')
    }

    // NOTAMS
    if (showNotams) {
      try {
        const gj = await api.notams(bbox)
        console.log('NOTAMs features:', gj?.features?.length || 0)
        setGeoJsonSource(map, 'notams', gj)
        ensureLayers(map)
        map.setLayoutProperty('notams-fill', 'visibility', 'visible')
        map.setLayoutProperty('notams-outline', 'visibility', 'visible')
      } catch (e) {
        console.error('NOTAMs load failed', e)
      }
    } else if (map.getLayer('notams-fill')) {
      map.setLayoutProperty('notams-fill', 'visibility', 'none')
      map.setLayoutProperty('notams-outline', 'visibility', 'none')
    }

    // DFP SPOOR
    if (showSpoor) {
      try {
        const gj = await api.dfpSpoor(bbox)
        console.log('DFP spoor features:', gj?.features?.length || 0)
        setGeoJsonSource(map, 'dfp-spoor', gj)
        ensureLayers(map)
        map.setLayoutProperty('dfp-spoor', 'visibility', 'visible')
      } catch (e) {
        console.error('DFP spoor load failed', e)
      }
    } else if (map.getLayer('dfp-spoor')) {
      map.setLayoutProperty('dfp-spoor', 'visibility', 'none')
    }

    // DFP LANDINGSITES
    if (showLandings) {
      try {
        const gj = await api.dfpLandingsites(bbox)
        console.log('DFP landingsites features:', gj?.features?.length || 0)
        setGeoJsonSource(map, 'dfp-landings', gj)
        ensureLayers(map)
        map.setLayoutProperty('dfp-landings', 'visibility', 'visible')
      } catch (e) {
        console.error('DFP landingsites load failed', e)
      }
    } else if (map.getLayer('dfp-landings')) {
      map.setLayoutProperty('dfp-landings', 'visibility', 'none')
    }
  }

  // Set up the map once
  useEffect(() => {
    mapboxgl.accessToken = TOKEN || ''
    const map = new mapboxgl.Map({
      container: 'mapbox3d',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [4.9, 52.37], // Amsterdam-ish
      zoom: 6,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    mapRef.current = map
    refreshRef.current = refreshLayers

    map.on('load', () => {
      console.log('Map loaded, initial refresh')
      refreshLayers()
    })
    map.on('moveend', () => {
      console.log('Map moveend, refresh')
      refreshLayers()
    })

    return () => {
      map.remove()
      mapRef.current = null
      refreshRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When toggles change, update ref + refresh
  useEffect(() => {
    togglesRef.current = { showZones, showNotams, showSpoor, showLandings }
    if (refreshRef.current) refreshRef.current()
  }, [showZones, showNotams, showSpoor, showLandings])

  return (
    <div className="map-wrapper">
      <div className="map-toggles">
        <label>
          <input
            type="checkbox"
            checked={showZones}
            onChange={(e) => setShowZones(e.target.checked)}
          />
          {' '}
          Restricted zones
        </label>
        <label>
          <input
            type="checkbox"
            checked={showNotams}
            onChange={(e) => setShowNotams(e.target.checked)}
          />
          {' '}
          NOTAMs
        </label>
        <label>
          <input
            type="checkbox"
            checked={showSpoor}
            onChange={(e) => setShowSpoor(e.target.checked)}
          />
          {' '}
          Rail (DFP spoor)
        </label>
        <label>
          <input
            type="checkbox"
            checked={showLandings}
            onChange={(e) => setShowLandings(e.target.checked)}
          />
          {' '}
          Landing sites (DFP)
        </label>
      </div>
      <div id="mapbox3d" className="map" />
    </div>
  )
}
