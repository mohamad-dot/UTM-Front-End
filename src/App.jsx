import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import PageHeader from './components/PageHeader.jsx'
import Map3D from './pages/Map3D.jsx'
import GeoAwareness from './pages/GeoAwareness.jsx'
import FlightAuthorization from './pages/FlightAuthorization.jsx'
import NetworkId from './pages/NetworkId.jsx'
import TrafficInfo from './pages/TrafficInfo.jsx'
import ConformanceMonitoring from './pages/ConformanceMonitoring.jsx'
import DroneHistory from './pages/DroneHistory.jsx'
import SystemHealth from './pages/SystemHealth.jsx'
import About from './pages/About.jsx'

export default function App(){
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <PageHeader />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to="/map" replace />} />
              <Route path="/map" element={<Map3D />} />
              <Route path="/geo-awareness" element={<GeoAwareness />} />
              <Route path="/flight-authorization" element={<FlightAuthorization />} />
              <Route path="/network-id" element={<NetworkId />} />
              <Route path="/traffic-info" element={<TrafficInfo />} />
              <Route path="/conformance-monitoring" element={<ConformanceMonitoring />} />
              <Route path="/drone-history" element={<DroneHistory />} />
              <Route path="/system-health" element={<SystemHealth />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}
