import { useState, useEffect } from 'react';
import userManagementService from '../../services/userManagementService';
import './UserManagement.css';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', password: '', role_id: '', department_id: '' });

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, deptRes] = await Promise.all([
        userManagementService.getAll(),
        userManagementService.getRoles(),
        userManagementService.getDepartments()
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      setError('Failed to load user management data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '', // Leave blank for edit unless they want to change it
        role_id: user.role?.id || '',
        department_id: user.department?.id || ''
      });
    } else {
      setIsEditing(false);
      setFormData({ id: null, name: '', email: '', password: '', role_id: '', department_id: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Clean payload
    const payload = { ...formData };
    if (!payload.department_id) payload.department_id = null;
    if (isEditing && !payload.password) delete payload.password; // Don't send empty pwd on update

    try {
      if (isEditing) {
        await userManagementService.update(payload.id, payload);
      } else {
        await userManagementService.create(payload);
      }
      closeModal();
      fetchData(); // Reload table
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userManagementService.delete(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  // Prepare derived data
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.department?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const [key, dir] = sortBy.split('-');
    let valA = key === 'department' ? (a.department?.name || '') : a[key] || '';
    let valB = key === 'department' ? (b.department?.name || '') : b[key] || '';
    if (valA < valB) return dir === 'asc' ? -1 : 1;
    if (valA > valB) return dir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="usermanager-page">
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">Add, update, or remove system access.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="🔍 Search user/dept..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ padding: '0.55rem 1rem', borderRadius: 'var(--radius-md)', minWidth: '180px' }}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
            <option value="department-asc">Sort: Department (A-Z)</option>
          </select>
          <button className="btn btn-primary" onClick={() => openModal()}>+ Add New User</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner"/></div>
      ) : (
        <div className="glass-card table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td className="text-sm">{u.email}</td>
                  <td><span className={`badge ${u.role?.name === 'HR' ? 'badge-success' : 'badge-info'}`}>{u.role?.name}</span></td>
                  <td>{u.department?.name || '—'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm" onClick={() => openModal(u)}>Edit</button>
                      <button className="btn btn-sm" onClick={() => handleDelete(u.id)} style={{color: '#f87171'}}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedUsers.length === 0 && (
                <tr>
                   <td colSpan="5" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>{isEditing ? 'Edit User' : 'New User'}</h2>
            {error && <div className="error-banner">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{isEditing ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                <input type="password" required={!isEditing} minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Role</label>
                  <select required value={formData.role_id} onChange={e => setFormData({...formData, role_id: e.target.value})}>
                    <option value="">Select Role...</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Department (Optional for HR)</label>
                  <select value={formData.department_id} onChange={e => setFormData({...formData, department_id: e.target.value})}>
                    <option value="">Select Department...</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
