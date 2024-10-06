// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css'; // Add your sidebar styles here
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportIcon from '@mui/icons-material/Report';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SettingsIcon from '@mui/icons-material/Settings';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <nav className="sidebar-nav">
        <img src="spclogo.png" alt="Logo" className="sidebar-logo" />

        <Link to="/dashboard" className="nav-link">
          <DashboardIcon className="nav-icon" /> Dashboard
        </Link>
        
        <Link to="/manage-item" className="nav-link">
          <InventoryIcon className="nav-icon" /> Manage Item
        </Link>
        
        <Link to="/approve-request" className="nav-link">
          <CheckCircleIcon className="nav-icon" /> Approved Purchased Request
        </Link>
        
        <Link to="/reports" className="nav-link">
          <ReportIcon className="nav-icon" /> Reports
        </Link>
        
        <Link to="/scanner" className="nav-link">
          <CameraAltIcon className="nav-icon" /> Scanner
        </Link>
        
        <Link to="/settings" className="nav-link">
          <SettingsIcon className="nav-icon" /> Settings
        </Link>
      </nav>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
