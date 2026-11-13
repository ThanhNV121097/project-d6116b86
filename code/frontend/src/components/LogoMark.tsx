/**
 * Ép's mark: a citrus slice — the rind, the pith and six segments — drawn in
 * currentColor so it takes the ink of wherever it stands. public/favicon.svg
 * is the same slice on the lime.
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <circle cx="16" cy="16" r="13.5" strokeWidth="2.25" />
      <circle cx="16" cy="16" r="9.5" strokeWidth="1.5" />
      <path d="M16 16V6.5M16 16v9.5M16 16l8.2-4.75M16 16l-8.2-4.75M16 16l8.2 4.75M16 16l-8.2 4.75" strokeWidth="1.5" />
    </svg>
  );
}
