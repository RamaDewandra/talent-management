import './NineBox.css';

const boxConfig = [
  // Row 1 (High Potential)
  { key: 'Inconsistent Player', row: 1, col: 1, color: '#fff3cd' },
  { key: 'High Potential', row: 1, col: 2, color: '#d4edda' },
  { key: 'Star', row: 1, col: 3, color: '#28a745' },
  // Row 2 (Medium Potential)
  { key: 'Underperformer', row: 2, col: 1, color: '#f8d7da' },
  { key: 'Core Player', row: 2, col: 2, color: '#d4edda' },
  { key: 'High Performer', row: 2, col: 3, color: '#28a745' },
  // Row 3 (Low Potential)
  { key: 'Risk', row: 3, col: 1, color: '#dc3545' },
  { key: 'Average Performer', row: 3, col: 2, color: '#fff3cd' },
  { key: 'Solid Performer', row: 3, col: 3, color: '#d4edda' },
];

export function NineBox({ data }) {
  return (
    <div className="nine-box-container">
      <div className="nine-box-label y-axis">
        <span>High</span>
        <span>Potential</span>
        <span>Low</span>
      </div>
      <div className="nine-box-grid">
        {boxConfig.map((box) => {
          const employees = data[box.key] || [];
          return (
            <div
              key={box.key}
              className="nine-box-cell"
              style={{
                gridRow: box.row,
                gridColumn: box.col,
                backgroundColor: box.color,
              }}
            >
              <div className="cell-header">
                <span className="cell-title">{box.key}</span>
                <span className="cell-count">{employees.length}</span>
              </div>
              <div className="cell-employees">
                {employees.slice(0, 3).map((emp) => (
                  <div key={emp.id} className="employee-chip">
                    {emp.employee_name}
                  </div>
                ))}
                {employees.length > 3 && (
                  <div className="more-employees">
                    +{employees.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="nine-box-label x-axis">
        <span>Low</span>
        <span>Performance</span>
        <span>High</span>
      </div>
    </div>
  );
}

export default NineBox;
