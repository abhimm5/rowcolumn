export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '30px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: '10px' }}>Rowscolumns</div>
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          marginBottom: '20px',
        }}
      >
        The logical layout engine for the modern web.
      </p>
      <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>© 2025 MIT License</div>
    </footer>
  );
}


