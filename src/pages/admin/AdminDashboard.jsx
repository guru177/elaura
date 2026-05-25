import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  HiOutlineHome, HiOutlineUsers, HiOutlineCog, HiOutlineLogout, 
  HiOutlineBell, HiOutlineSearch, HiOutlineChartBar, HiOutlineMail, HiOutlineBookOpen, HiOutlineStar
} from 'react-icons/hi';
import CoursesAdmin from '../../components/admin/CoursesAdmin';
import TestimonialsAdmin from '../../components/admin/TestimonialsAdmin';
import TrainersAdmin from '../../components/admin/TrainersAdmin';
import SEOAdmin from '../../components/admin/SEOAdmin';
import GalleryAdmin from '../../components/admin/GalleryAdmin';
import { FiImage } from 'react-icons/fi';
import './AdminDashboard.css';

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [coursesCount, setCoursesCount] = useState(0);
  const [trainersCount, setTrainersCount] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('elaura_admin_auth');
    if (token !== 'elaura_admin_2026') {
      navigate('/admin/login');
      return;
    }

    fetchLeads(token);
    fetchContacts(token);
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const coursesUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_courses.php' : '/backend/get_courses.php';
      const trainersUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000/manage_trainers.php' : '/backend/manage_trainers.php';
      
      const [coursesRes, trainersRes] = await Promise.all([
        fetch(coursesUrl),
        fetch(trainersUrl)
      ]);
      
      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        if (Array.isArray(courses)) setCoursesCount(courses.length);
      }
      
      if (trainersRes.ok) {
        const trainers = await trainersRes.json();
        if (Array.isArray(trainers)) setTrainersCount(trainers.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeads = async (token) => {
    try {
      setLoading(true);
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_leads.php' : '/backend/get_leads.php';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (token) => {
    try {
      setLoadingContacts(true);
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/get_contacts.php' : '/backend/get_contacts.php';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    
    const token = localStorage.getItem('elaura_admin_auth');
    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/delete_lead.php' : '/backend/delete_lead.php';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== id));
      } else {
        alert("Failed to delete lead.");
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
      alert("Error deleting lead.");
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;
    
    const token = localStorage.getItem('elaura_admin_auth');
    try {
      const url = window.location.hostname === 'localhost' ? 'http://localhost:8000/delete_contact.php' : '/backend/delete_contact.php';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== id));
      } else {
        alert("Failed to delete contact.");
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
      alert("Error deleting contact.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('elaura_admin_auth');
    navigate('/admin/login');
  };

  // Process data for charts
  const areaData = useMemo(() => {
    const counts = {};
    leads.forEach(lead => {
      const area = lead.interestedArea || 'Other';
      counts[area] = (counts[area] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [leads]);

  const timelineData = useMemo(() => {
    const counts = {};
    leads.forEach(lead => {
      if(lead.date) {
        const date = lead.date.split(' ')[0]; // YYYY-MM-DD
        counts[date] = (counts[date] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days
  }, [leads]);

  const newToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let count = 0;
    leads.forEach(lead => {
      if(lead.date && lead.date.startsWith(todayStr)) {
        count++;
      }
    });
    return count;
  }, [leads]);

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // 1. Search Filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(lead => 
        (lead.name && lead.name.toLowerCase().includes(lowerSearch)) ||
        (lead.email && lead.email.toLowerCase().includes(lowerSearch)) ||
        (lead.phone && lead.phone.toLowerCase().includes(lowerSearch)) ||
        (lead.interestedArea && lead.interestedArea.toLowerCase().includes(lowerSearch))
      );
    }

    // 2. Date Filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      
      result = result.filter(lead => {
        if (!lead.date) return false;
        const leadDateStr = lead.date.split(' ')[0]; // YYYY-MM-DD
        const leadDateObj = new Date(leadDateStr);

        if (dateFilter === 'today') {
          return leadDateStr === todayStr;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return leadDateObj >= weekAgo;
        } else if (dateFilter === 'month') {
          return leadDateObj.getMonth() === now.getMonth() && leadDateObj.getFullYear() === now.getFullYear();
        } else if (dateFilter === 'year') {
          return leadDateObj.getFullYear() === now.getFullYear();
        } else if (dateFilter === 'custom' && customDate) {
          return leadDateStr === customDate;
        }
        return true;
      });
    }

    // 3. Sort
    if (sortConfig.key !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [leads, sortConfig, searchTerm, dateFilter, customDate]);

  // Exports
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Elaura Academy Leads", 14, 15);
      const tableColumn = ["Date", "Name", "Phone", "Email", "Age", "Area"];
      const tableRows = filteredAndSortedLeads.map(l => [
        l.date ? l.date.split(' ')[0] : 'N/A', 
        l.name || 'N/A', 
        l.phone || 'N/A', 
        l.email || 'N/A', 
        l.age || 'N/A', 
        l.interestedArea || 'N/A'
      ]);
      
      autoTable(doc, { 
        head: [tableColumn], 
        body: tableRows, 
        startY: 20, 
        styles: { fontSize: 8 } 
      });
      
      doc.save("elaura-leads.pdf");
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Failed to export PDF. Please check the console.");
    }
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAndSortedLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "elaura-leads.xlsx");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>ELAURA</h2>
        </div>
        <div className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <HiOutlineHome /> Overview
          </div>
          <div className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <HiOutlineUsers /> Lead Management
          </div>
          <div className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
            <HiOutlineMail /> Contact Messages
          </div>
          <div className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            <HiOutlineBookOpen /> Courses Management
          </div>
          <div className={`nav-item ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
            <HiOutlineStar /> Testimonials
          </div>
          <div className={`nav-item ${activeTab === 'trainers' ? 'active' : ''}`} onClick={() => setActiveTab('trainers')}>
            <HiOutlineUsers /> Trainers
          </div>
          <div className={`nav-item ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>
            <HiOutlineSearch /> SEO & Meta
          </div>
          <div className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>
            <FiImage style={{ marginRight: '15px', fontSize: '18px' }} /> Gallery
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <HiOutlineLogout /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Topbar */}
        <div className="dashboard-topbar">
          <div className="search-bar">
            <HiOutlineSearch />
            <input type="text" placeholder="Search leads, areas..." />
          </div>
          <div className="topbar-right">
            <button className="icon-btn">
              <HiOutlineMail />
              <div className="badge-dot"></div>
            </button>
            <button className="icon-btn">
              <HiOutlineBell />
              <div className="badge-dot"></div>
            </button>
            <div className="user-profile">
              <img src="https://i.pravatar.cc/100?img=11" alt="Super Admin" />
              <div className="user-info">
                <h4>Super Admin</h4>
                <p>System Controller</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="dashboard-content-area">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                
                {/* Stats */}
                <div className="overview-grid">
                  <div className="stat-card">
                    <div className="stat-icon dark"><HiOutlineUsers /></div>
                    <div className="stat-info">
                      <h3>{leads.length}</h3>
                      <p>Total Leads</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon dark"><HiOutlineChartBar /></div>
                    <div className="stat-info">
                      <h3>+{newToday}</h3>
                      <p>New Leads Today</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon dark"><HiOutlineMail /></div>
                    <div className="stat-info">
                      <h3>{contacts.length}</h3>
                      <p>Contact Messages</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon dark"><HiOutlineBookOpen /></div>
                    <div className="stat-info">
                      <h3>{coursesCount}</h3>
                      <p>Active Courses</p>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Leads Timeline (Last 7 Days)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={timelineData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <RechartsTooltip cursor={{ fill: '#f1f5f9' }} />
                          <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h3>Top Interest Areas</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={areaData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                            {areaData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                  <div className="recent-card" style={{ background: '#fff', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Recent Leads</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {leads.slice(0, 5).map(lead => (
                        <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>{lead.name}</p>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>{lead.interestedArea}</span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px' }}>{lead.date?.split(' ')[0]}</span>
                        </div>
                      ))}
                      {leads.length === 0 && <p style={{ color: '#64748b', fontSize: '14px' }}>No leads yet.</p>}
                    </div>
                  </div>

                  <div className="recent-card" style={{ background: '#fff', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Recent Contact Messages</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {contacts.slice(0, 5).map(contact => (
                        <div key={contact.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>{contact.name}</p>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>{contact.subject?.length > 30 ? contact.subject.substring(0,30) + '...' : contact.subject}</span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px' }}>{contact.date?.split(' ')[0]}</span>
                        </div>
                      ))}
                      {contacts.length === 0 && <p style={{ color: '#64748b', fontSize: '14px' }}>No messages yet.</p>}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'leads' && (
              <motion.div key="leads" className="leads-dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="leads-header-flex">
                  <h2>Lead Database</h2>
                  <div className="admin-actions">
                    <button onClick={exportExcel} className="btn-excel">Export Excel</button>
                    <button onClick={exportPDF} className="btn-pdf">Export PDF</button>
                  </div>
                </div>

                <div className="table-filters">
                  <div className="filter-search">
                    <HiOutlineSearch />
                    <input 
                      type="text" 
                      placeholder="Search by name, email, phone, or course..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="filter-options">
                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                      <option value="custom">Custom Date</option>
                    </select>
                    {dateFilter === 'custom' && (
                      <input 
                        type="date" 
                        value={customDate} 
                        onChange={(e) => setCustomDate(e.target.value)} 
                        className="custom-date-picker"
                      />
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="admin-loading">Loading leads database...</div>
                ) : filteredAndSortedLeads.length === 0 ? (
                  <div className="admin-empty">No leads match your search criteria.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('date')}>Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th>Contact</th>
                        <th onClick={() => handleSort('interestedArea')}>Course Area</th>
                        <th>Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedLeads.map((lead) => (
                        <tr key={lead.id}>
                          <td>{lead.date ? lead.date.split(' ')[0] : 'N/A'}</td>
                          <td>
                            <div className="fw-bold">{lead.name}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Age: {lead.age}</div>
                          </td>
                          <td>
                            <div><a href={`mailto:${lead.email}`}>{lead.email}</a></div>
                            <div style={{ fontSize: '12px', marginTop: '4px' }}><a href={`tel:${lead.phone}`} style={{ color: '#64748b' }}>{lead.phone}</a></div>
                          </td>
                          <td><span className="badge-area">{lead.interestedArea}</span></td>
                          <td>{lead.address}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-view" onClick={() => setSelectedLead(lead)}>View</button>
                              <button className="btn-delete" onClick={() => handleDeleteLead(lead.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}

            {activeTab === 'contacts' && (
              <motion.div key="contacts" className="leads-dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="leads-header-flex">
                  <h2>Contact Submissions</h2>
                </div>

                {loadingContacts ? (
                  <div className="admin-loading">Loading contact messages...</div>
                ) : contacts.length === 0 ? (
                  <div className="admin-empty">No contact messages found.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Subject</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.id}>
                          <td>{contact.date ? contact.date.split(' ')[0] : 'N/A'}</td>
                          <td>
                            <div className="fw-bold">{contact.name}</div>
                          </td>
                          <td>
                            <div><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
                            <div style={{ fontSize: '12px', marginTop: '4px' }}><a href={`tel:${contact.phone}`} style={{ color: '#64748b' }}>{contact.phone}</a></div>
                          </td>
                          <td>{contact.subject}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-view" onClick={() => setSelectedLead({...contact, isContact: true})}>View</button>
                              <button className="btn-delete" onClick={() => handleDeleteContact(contact.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div key="courses" className="leads-dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <CoursesAdmin token={localStorage.getItem('elaura_admin_auth')} />
              </motion.div>
            )}

            {activeTab === 'testimonials' && (
              <motion.div key="testimonials" className="leads-dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <TestimonialsAdmin token={localStorage.getItem('elaura_admin_auth')} />
              </motion.div>
            )}

            {activeTab === 'trainers' && (
              <motion.div key="trainers" className="leads-dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <TrainersAdmin token={localStorage.getItem('elaura_admin_auth')} />
              </motion.div>
            )}

            {activeTab === 'seo' && (
              <motion.div key="seo" className="leads-dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <SEOAdmin token={localStorage.getItem('elaura_admin_auth')} />
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div key="gallery" className="leads-dashboard-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <GalleryAdmin token={localStorage.getItem('elaura_admin_auth')} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Lead Details Popup Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="admin-modal-overlay" onClick={() => setSelectedLead(null)}>
            <motion.div 
              className="admin-modal-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>Lead Details</h2>
                <button className="close-btn" onClick={() => setSelectedLead(null)}>&times;</button>
              </div>
              <div className="admin-modal-body">
                <div className="detail-row"><strong>Name:</strong> <span>{selectedLead.name}</span></div>
                <div className="detail-row"><strong>Email:</strong> <span>{selectedLead.email}</span></div>
                <div className="detail-row"><strong>Phone:</strong> <span>{selectedLead.phone}</span></div>
                {!selectedLead.isContact && <div className="detail-row"><strong>Age:</strong> <span>{selectedLead.age}</span></div>}
                {!selectedLead.isContact && <div className="detail-row"><strong>Interested Area:</strong> <span>{selectedLead.interestedArea}</span></div>}
                {!selectedLead.isContact && <div className="detail-row"><strong>Location/Address:</strong> <span>{selectedLead.address}</span></div>}
                {selectedLead.isContact && <div className="detail-row"><strong>Subject:</strong> <span>{selectedLead.subject}</span></div>}
                <div className="detail-row"><strong>Date Submitted:</strong> <span>{selectedLead.date}</span></div>
                
                <div className="detail-message-box">
                  <strong>Message / Query:</strong>
                  <p>{selectedLead.message}</p>
                </div>
              </div>
              <div className="admin-modal-footer">
                <a href={`mailto:${selectedLead.email}`} className="btn-primary">Reply via Email</a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
