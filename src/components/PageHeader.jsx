import React from 'react'
import { useLocation } from 'react-router-dom'

export default function PageHeader(){
  const { pathname } = useLocation()
  const titleMap = {
    '/map': 'Mapbox 3D • Zones • NOTAMs • DFP layers',
    '/geo-awareness':'Geo-awareness',
    '/flight-authorization':'Flight Authorization',
    '/network-id':'Network Identification',
    '/traffic-info':'Traffic Information',
    '/conformance-monitoring':'Conformance Monitoring',
    '/drone-history':'Drone flight history',
    '/system-health':'System health',
    '/about':'About'
  }
  const title = titleMap[pathname] || 'UTM Dashboard'
  return <header className="page-header"><div className="title">{title}</div></header>
}
