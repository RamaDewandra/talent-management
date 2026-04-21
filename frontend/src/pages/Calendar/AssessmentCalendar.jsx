import { useState, useEffect } from 'react';
import periodService from '../../services/periodService';
import './AssessmentCalendar.css';

export function AssessmentCalendar() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    try {
      const response = await periodService.getAll();
      setPeriods(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDayStatus = (date) => {
    // Check if this date falls within any period
    const matchedPeriod = periods.find(p => {
      const start = new Date(p.start_date);
      const end = new Date(p.end_date);
      // Strip time
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return date >= start && date <= end;
    });

    if (!matchedPeriod) return null;
    return matchedPeriod.status; // 'active', 'closed', 'draft'
  };

  if (loading) return <div className="loading-state"><div className="spinner"></div></div>;

  return (
    <div className="calendar-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assessment Calendar</h1>
          <p className="page-subtitle">Timeline and schedule of all assessment periods.</p>
        </div>
        <div className="year-picker">
          <button onClick={() => setCurrentYear(y => y - 1)}>◀</button>
          <h2>{currentYear}</h2>
          <button onClick={() => setCurrentYear(y => y + 1)}>▶</button>
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item"><span className="dot dot-active"></span> Active</div>
        <div className="legend-item"><span className="dot dot-draft"></span> Draft</div>
        <div className="legend-item"><span className="dot dot-closed"></span> Closed</div>
      </div>

      <div className="calendar-grid">
        {months.map((monthName, monthIndex) => {
          const daysInMonth = getDaysInMonth(monthIndex, currentYear);
          const firstDay = getFirstDayOfMonth(monthIndex, currentYear);
          const blanks = Array.from({ length: firstDay }, (_, i) => i);
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

          return (
            <div key={monthName} className="month-card glass-card">
              <h3 className="month-name">{monthName}</h3>
              <div className="days-header">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div className="days-grid">
                {blanks.map(b => <div key={`blank-${b}`} className="calendar-day empty"></div>)}
                {days.map(d => {
                  const dateObj = new Date(currentYear, monthIndex, d);
                  const status = getDayStatus(dateObj);
                  return (
                    <div 
                      key={d} 
                      className={`calendar-day ${status ? 'has-period status-' + status : ''}`}
                      title={status ? `Period is ${status}` : ''}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="timeline-list glass-card" style={{ marginTop: '1.5rem' }}>
        <h3>{currentYear} Schedule Details</h3>
        <table className="data-table">
            <thead>
                <tr>
                    <th>Period Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {periods.filter(p => new Date(p.start_date).getFullYear() === currentYear || new Date(p.end_date).getFullYear() === currentYear).length > 0 ? (
                    periods.filter(p => new Date(p.start_date).getFullYear() === currentYear || new Date(p.end_date).getFullYear() === currentYear).map(p => (
                        <tr key={p.id}>
                            <td><strong>{p.name}</strong></td>
                            <td>{p.start_date}</td>
                            <td>{p.end_date}</td>
                            <td><span className={`badge ${p.status === 'active' ? 'active' : p.status === 'closed' ? 'closed' : 'draft'}`}>{p.status}</span></td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="4" style={{textAlign:'center', color:'var(--text-muted)'}}>No periods scheduled for {currentYear}.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssessmentCalendar;
