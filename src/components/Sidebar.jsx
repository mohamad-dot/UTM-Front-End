import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/map',                   label: 'Map' },
  { to: '/geo-awareness',         label: 'Geo-awareness' },
  { to: '/flight-authorization',  label: 'Flight Authorization' },
  { to: '/network-id',            label: 'Network Identification' },
  { to: '/traffic-info',          label: 'Traffic Information' },
  { to: '/conformance-monitoring',label: 'Conformance Monitoring' },
  { to: '/drone-history',         label: 'Drone Flight History' },
  { to: '/system-health',         label: 'System Health' },
  { to: '/about',                 label: 'About' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">UTM</div>
      <nav className="nav">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
            end
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <footer className="sidebar-footer">Holding the Drones • UTM</footer>
    </aside>
  );
}
