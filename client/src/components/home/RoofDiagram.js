// Illustration of a measured roof (top-down), like the diagram in a report.
export default function RoofDiagram({ className = "" }) {
  return (
    <svg viewBox="0 0 480 380" className={className} role="img" aria-label="Example roof measurement diagram">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0v20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
        </pattern>
      </defs>
      <rect width="480" height="380" rx="16" fill="url(#grid)" />

      {/* Roof facets */}
      <g stroke="#fdba74" strokeWidth="2" strokeLinejoin="round">
        <polygon points="70,90 410,90 330,170 150,170" fill="#f97316" fillOpacity="0.35" />
        <polygon points="70,90 150,170 70,250" fill="#f97316" fillOpacity="0.2" />
        <polygon points="410,90 410,250 330,170" fill="#f97316" fillOpacity="0.2" />
        <polygon points="70,250 150,170 330,170 410,250" fill="#f97316" fillOpacity="0.28" />
        <polygon points="240,250 290,300 190,300" fill="#f97316" fillOpacity="0.2" />
        <polygon points="190,300 290,300 290,330 190,330" fill="#f97316" fillOpacity="0.12" />
      </g>

      {/* Ridge (highlighted) */}
      <line x1="150" y1="170" x2="330" y2="170" stroke="#ff8a1f" strokeWidth="4" strokeLinecap="round" />

      {/* Facet labels */}
      <g fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="600" fill="white" textAnchor="middle">
        <text x="240" y="135">A · 8/12</text>
        <text x="100" y="175">B</text>
        <text x="385" y="175">C</text>
        <text x="240" y="220">D · 8/12</text>
      </g>

      {/* Measurement callouts */}
      <g fontFamily="ui-sans-serif, system-ui" fontSize="12" fill="#d6d3d1" textAnchor="middle">
        <line x1="70" y1="70" x2="410" y2="70" stroke="#a8a29e" strokeDasharray="4 4" />
        <text x="240" y="62">Eave 42&apos; 6&quot;</text>
        <text x="240" y="162" fill="#ffb066" fontWeight="600">Ridge 22&apos; 3&quot;</text>
        <line x1="430" y1="90" x2="430" y2="250" stroke="#a8a29e" strokeDasharray="4 4" />
        <text x="448" y="174" transform="rotate(90 448 174)">Rake 19&apos; 8&quot;</text>
      </g>
    </svg>
  );
}
