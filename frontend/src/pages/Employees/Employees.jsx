import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeProfileService from '../../services/employeeProfileService';
import './Employees.css';

export function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users — consistent with EmployeeController::show() that allows any role
    employeeProfileService.getAll()
      .then(r => setEmployees(r.data || []))
      .catch(err => console.error('Failed to load employees:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.department?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const [key, dir] = sortBy.split('-');
    let valA = key === 'department' ? (a.department?.name || '') : a[key] || '';
    let valB = key === 'department' ? (b.department?.name || '') : b[key] || '';
    if (valA < valB) return dir === 'asc' ? -1 : 1;
    if (valA > valB) return dir === 'asc' ? 1 : -1;
    return 0;
  });

  const getInitials = (name) => name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Click on an employee to view their full profile & history.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍  Search by name or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            style={{ margin: 0, padding: '0.65rem 1.25rem' }}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.7rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
            <option value="department-asc">Sort: Department (A-Z)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /><p>Loading employees...</p></div>
      ) : (
        <div className="employee-grid">
          {sorted.length === 0
            ? <p className="no-data-msg">No employees found.</p>
            : sorted.map(emp => (
              <div
                key={emp.id}
                className="employee-card glass-card"
                onClick={() => navigate(`/employees/${emp.id}`)}
              >
                <div className="emp-avatar">{getInitials(emp.name)}</div>
                <div className="emp-info">
                  <div className="emp-name">{emp.name}</div>
                  <div className="emp-dept">{emp.department?.name || '—'}</div>
                  <div className="emp-email">{emp.email}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                  {emp.role?.name && (
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                      borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: emp.role.name === 'HR' ? 'rgba(16,185,129,0.15)' : emp.role.name === 'Manager' ? 'rgba(99,102,241,0.15)' : 'rgba(148,163,184,0.1)',
                      color: emp.role.name === 'HR' ? '#34d399' : emp.role.name === 'Manager' ? '#a78bfa' : '#94a3b8',
                      border: `1px solid ${emp.role.name === 'HR' ? 'rgba(16,185,129,0.3)' : emp.role.name === 'Manager' ? 'rgba(99,102,241,0.3)' : 'rgba(148,163,184,0.2)'}`,
                    }}>{emp.role.name}</span>
                  )}
                  <div className="emp-arrow">→</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default Employees;
