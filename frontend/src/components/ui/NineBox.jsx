import { useNavigate } from 'react-router-dom';
import './NineBox.css';

const boxConfig = [
  // Row 1 (High Potential) — left to right = Low to High performance
  { key: 'Inconsistent Player', row: 1, col: 1, colorClass: 'box-warning',  icon: '⚡' },
  { key: 'High Potential',      row: 1, col: 2, colorClass: 'box-info',     icon: '🌱' },
  { key: 'Star',                row: 1, col: 3, colorClass: 'box-success',  icon: '⭐' },
  // Row 2 (Medium Potential)
  { key: 'Underperformer',      row: 2, col: 1, colorClass: 'box-danger',   icon: '⚠️' },
  { key: 'Core Player',         row: 2, col: 2, colorClass: 'box-neutral',  icon: '🎯' },
  { key: 'High Performer',      row: 2, col: 3, colorClass: 'box-success',  icon: '🚀' },
  // Row 3 (Low Potential)
  { key: 'Risk',                row: 3, col: 1, colorClass: 'box-danger',   icon: '🔴' },
  { key: 'Average Performer',   row: 3, col: 2, colorClass: 'box-warning',  icon: '📊' },
  { key: 'Solid Performer',     row: 3, col: 3, colorClass: 'box-info',     icon: '✅' },
];

export function NineBox({ data }) {
  const navigate = useNavigate();
  const safeData = data || {};

  return (
    <div className="nine-box-wrapper">
      {/* Y-axis */}
      <div className="y-axis-label">
        <span className="axis-end">High</span>
        <span className="axis-title">POTENTIAL</span>
        <span className="axis-end">Low</span>
      </div>

      {/* Grid */}
      <div className="nine-box-grid">
        {boxConfig.map((box) => {
          const employees = safeData[box.key] || [];
          const hasMore = employees.length > 0;

          return (
            <div
              key={box.key}
              className={`nine-box-cell ${box.colorClass} ${employees.length === 0 ? 'cell-empty' : ''}`}
              style={{ gridRow: box.row, gridColumn: box.col }}
            >
              {/* Header */}
              <div className="cell-header">
                <div className="cell-title-row">
                  <span className="cell-icon">{box.icon}</span>
                  <span className="cell-title">{box.key}</span>
                </div>
                <span className="cell-count">{employees.length}</span>
              </div>

              {/* Employees list */}
              {employees.length > 0 ? (
                <div className="cell-body">
                  <div className="cell-employees">
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        className="emp-row"
                        onClick={() => navigate(`/employees/${emp.employee_id}`)}
                        title={`Lihat profil ${emp.employee_name}`}
                      >
                        <span className="emp-avatar-mini">
                          {emp.employee_name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                        </span>
                        <span className="emp-name-text">{emp.employee_name}</span>
                        <span className="emp-arrow-mini">›</span>
                      </button>
                    ))}
                  </div>
                  {employees.length > 3 && (
                    <div className="scroll-indicator">
                      <span>↓ {employees.length - 3} lainnya</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="cell-empty-state">No employees</div>
              )}
            </div>
          );
        })}
      </div>

      {/* X-axis */}
      <div className="x-axis-spacer" />
      <div className="x-axis-label">
        <span className="axis-end">Low</span>
        <span className="axis-title">PERFORMANCE</span>
        <span className="axis-end">High</span>
      </div>
    </div>
  );
}

export default NineBox;
