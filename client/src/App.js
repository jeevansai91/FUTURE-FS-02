import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './App.css';

function App() {
  // --- AUTH STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- CRM STATES ---
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // FIXED: Removed http://localhost:5000 to use Vercel routing
  const fetchLeads = async () => {
    try {
      const res = await axios.get('/api/leads');
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLeads();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@intern.com" && loginPassword === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials! Please use the demo login provided below.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  // FIXED: Changed to relative path
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leads', { name, email });
      setName('');
      setEmail('');
      fetchLeads(); 
      alert("Lead Added Successfully!");
    } catch (err) {
      alert("Error saving lead. Check if your MongoDB is connected!");
    }
  };

  // FIXED: Changed to relative path
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/leads/${id}`, { status: newStatus });
      fetchLeads(); 
    } catch (err) {
      alert("Error updating status");
    }
  };

  // FIXED: Changed to relative path
  const updateNotes = async (id, newNotes) => {
    try {
      await axios.put(`/api/leads/${id}`, { notes: newNotes });
      setLeads(leads.map(lead => lead._id === id ? { ...lead, notes: newNotes } : lead));
    } catch (err) {
      console.error("Error updating notes", err);
    }
  };

  // FIXED: Changed to relative path
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`/api/leads/${id}`);
        fetchLeads(); 
      } catch (err) {
        alert("Error deleting lead");
      }
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    { name: 'New', value: leads.filter(l => l.status === 'New').length },
    { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length },
    { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length },
  ];

  const COLORS = ['#ffeaa7', '#81ecec', '#55efc4'];

  // --- LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>🔐 CRM Login</h2>
          <p>Smart CRM for Modern Business.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              required 
            />
            <button type="submit" className="login-btn">Login</button>
          </form>

          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ddd' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f8c8d' }}>
              <strong>Demo Credentials:</strong><br />
              User: <code>admin@intern.com</code><br />
              Pass: <code>1234</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="App">
      <header className="crm-header">
        <h1>Client Lead Management System (Mini CRM)</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <main className="container">
        <div className="dashboard-top">
          <div className="stats-grid">
            <div className="stat-card total">
              <h3>Total Leads</h3>
              <p>{leads.length}</p>
            </div>
            <div className="stat-card new">
              <h3>New Leads</h3>
              <p>{leads.filter(l => l.status === 'New').length}</p>
            </div>
            <div className="stat-card contacted">
              <h3>Contacted</h3>
              <p>{leads.filter(l => l.status === 'Contacted').length}</p>
            </div>
            <div className="stat-card converted">
              <h3>Converted</h3>
              <p>{leads.filter(l => l.status === 'Converted').length}</p>
            </div>
          </div>

          <div className="chart-container">
            <h3>Lead Distribution</h3>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <section className="search-section">
          <input 
            type="text" 
            placeholder="🔍 Search leads by name or email..." 
            className="search-input"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>

        <section className="form-section">
          <h2>Add New Lead</h2>
          <form className="lead-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit">Add Lead</button>
          </form>
        </section>

        <section className="table-section">
          <h2>Manage Leads</h2>
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td><span className={`status-badge ${lead.status}`}>{lead.status}</span></td>
                  <td>
                    <input 
                      type="text"
                      className="notes-input"
                      placeholder="Add a note..."
                      value={lead.notes || ""}
                      onChange={(e) => updateNotes(lead._id, e.target.value)}
                    />
                  </td>
                  <td>
                    <select 
                      onChange={(e) => updateStatus(lead._id, e.target.value)}
                      value={lead.status}
                      style={{ marginRight: '10px' }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                    </select>
                    <button className="delete-btn" onClick={() => handleDelete(lead._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;