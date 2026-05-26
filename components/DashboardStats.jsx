// components/DashboardStats.jsx
export default function DashboardStats({ stats }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      <div style={{
        backgroundColor: '#f0f8ff',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
      }}>
        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
          LESSONS COMPLETED
        </p>
        <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
          {stats.lessonsCompleted} / 26
        </p>
        <div style={{
          backgroundColor: '#ddd',
          height: '4px',
          borderRadius: '2px',
          marginTop: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#007bff',
            height: '100%',
            width: `${(stats.lessonsCompleted / 26) * 100}%`,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      <div style={{
        backgroundColor: '#f0f8f0',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #28a745'
      }}>
        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
          AVERAGE SCORE
        </p>
        <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
          {stats.averageScore}%
        </p>
        <p style={{
          margin: '10px 0 0 0',
          fontSize: '12px',
          color: '#666'
        }}>
          {stats.averageScore >= 70 ? '✓ Great progress!' : 'Keep studying!'}
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff8f0',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #ffc107'
      }}>
        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
          SPECIALIZATION
        </p>
        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ffc107', textTransform: 'capitalize' }}>
          {stats.specialization === 'sales' ? 'Sales Automation' : 'Customer Service'}
        </p>
        <p style={{
          margin: '10px 0 0 0',
          fontSize: '12px',
          color: '#666'
        }}>
          Tier 2 Path
        </p>
      </div>
    </div>
  );
}
