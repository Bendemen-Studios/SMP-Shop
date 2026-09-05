export default function Loading() {
  return (
    <main
      className="route-loading"
      aria-label="Pagina laden"
      style={{
        minHeight: '70vh',
        display: 'grid',
        placeItems: 'center',
        padding: '60px 22px',
        background: 'radial-gradient(circle at 50% 35%, #1d1109 0, #080706 55%, #050504 100%)',
      }}
    >
      <div
        style={{
          width: 'min(460px, 100%)',
          padding: '42px 30px',
          textAlign: 'center',
          background: 'linear-gradient(145deg, #17100b, #0b0907)',
          border: '1px solid #6d4522',
          boxShadow: '0 25px 70px #0009',
        }}
      >
        <div
          style={{
            fontSize: 42,
            color: '#d79845',
            lineHeight: 1,
            marginBottom: 20,
            animation: 'route-loading-spin 2s linear infinite',
          }}
          aria-hidden="true"
        >
          ⚙
        </div>
        <div style={{ color: '#d79845', fontSize: 10, fontWeight: 700, letterSpacing: 3 }}>
          STEAMPUNK SMP
        </div>
        <strong style={{ display: 'block', marginTop: 10, color: '#f1d2a2', fontFamily: 'Cinzel, serif', fontSize: 24 }}>
          Even geduld…
        </strong>
        <span style={{ display: 'block', marginTop: 8, color: '#9d896e', fontSize: 12 }}>
          De volgende pagina wordt geladen.
        </span>
      </div>
      <style>{`@keyframes route-loading-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.route-loading-spin{animation:none}}`}</style>
    </main>
  );
}
