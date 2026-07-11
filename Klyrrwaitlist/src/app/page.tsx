import Link from 'next/link';

export default function Home() {
  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#F9F6F0',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#F0EAE1',
        border: '1px solid #E6DCD0',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: '#3F1522',
        marginBottom: '24px'
      }}>
        ✨ Klyrr Opportunities
      </div>

      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        fontWeight: 700,
        lineHeight: 1.15,
        color: '#3F1522',
        marginBottom: '8px'
      }}>
        Build your profile.
        <span style={{ color: '#C09E53', display: 'block' }}>Track your growth.</span>
      </h1>

      <p style={{
        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
        color: '#7E6E65',
        maxWidth: '600px',
        lineHeight: 1.6,
        margin: '16px auto 32px auto'
      }}>
        Discover prestigious hackathons, track your coding consistency, and build a portfolio that stands out to top universities and recruiters.
      </p>

      <Link href="/hackathons" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#3F1522',
        color: '#FFFFFF',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: 600,
        textDecoration: 'none',
        boxShadow: '0 4px 15px rgba(63, 21, 34, 0.25)',
        transition: 'transform 0.2s, opacity 0.2s'
      }}>
        Open Dashboard →
      </Link>

      <div style={{
        display: 'flex',
        gap: '24px',
        marginTop: '60px',
        fontSize: '13px',
        fontWeight: 500,
        color: '#7E6E65'
      }}>
        <span>🏆 Global Hackathons</span>
        <span>💻 Activity Tracking</span>
      </div>
    </section>
  );
}
