import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import CoursesAdmin from '../components/admin/CoursesAdmin';
import './Admin.css';

const Admin = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('leads');
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const fetchLeads = async (token) => {
    try {
      setLoading(true);
      // Use local dev server for testing, or relative for prod
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_leads.php' : '/backend/get_leads.php';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        throw new Error('Invalid Admin Password');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();
      setLeads(data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLeads(password);
  };

  // Sorting Logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = React.useMemo(() => {
    let sortableItems = [...leads];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [leads, sortConfig]);

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Elaura Academy Leads", 14, 15);
    
    const tableColumn = ["Date", "Name", "Phone", "Email", "Age", "Interested Area", "Address", "Message"];
    const tableRows = [];

    sortedLeads.forEach(lead => {
      const leadData = [
        lead.date,
        lead.name,
        lead.phone,
        lead.email,
        lead.age,
        lead.interestedArea,
        lead.address,
        lead.message
      ];
      tableRows.push(leadData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });
    
    doc.save("elaura-leads.pdf");
  };

  // Export to Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "elaura-leads.xlsx");
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Admin Dashboard</h2>
          <p>Please enter the secret token to view leads.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="admin-error">{error}</div>}
            <button type="submit">Login</button>
          </form>
          <p className="admin-hint">Hint: elaura_admin_2026</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs" style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <button 
          style={{ background: 'none', border: 'none', fontSize: '18px', fontWeight: activeTab === 'leads' ? 'bold' : 'normal', color: activeTab === 'leads' ? '#3b82f6' : '#64748b', cursor: 'pointer', padding: '10px 20px' }}
          onClick={() => setActiveTab('leads')}
        >
          Leads Management
        </button>
        <button 
          style={{ background: 'none', border: 'none', fontSize: '18px', fontWeight: activeTab === 'courses' ? 'bold' : 'normal', color: activeTab === 'courses' ? '#3b82f6' : '#64748b', cursor: 'pointer', padding: '10px 20px' }}
          onClick={() => setActiveTab('courses')}
        >
          Courses Management
        </button>
      </div>

      {activeTab === 'courses' ? (
        <CoursesAdmin token={password} />
      ) : (
        <>
          <div className="admin-header">
            <div>
              <h1>Leads Dashboard</h1>
              <p>Total Leads: {leads.length}</p>
            </div>
            <div className="admin-actions">
              <button onClick={exportExcel} className="btn-excel">Export Excel</button>
              <button onClick={exportPDF} className="btn-pdf">Export PDF</button>
              <button onClick={() => fetchLeads(password)} className="btn-refresh">Refresh</button>
            </div>
          </div>

          <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="admin-empty">No leads found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')}>Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('phone')}>Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('age')}>Age {sortConfig.key === 'age' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('interestedArea')}>Interested Area {sortConfig.key === 'interestedArea' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                <th>Address</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.date}</td>
                  <td className="fw-bold">{lead.name}</td>
                  <td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td>
                  <td><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
                  <td>{lead.age}</td>
                  <td>{lead.interestedArea}</td>
                  <td>{lead.address}</td>
                  <td className="message-cell">{lead.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default Admin;
