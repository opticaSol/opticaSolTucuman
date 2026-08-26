const COLORS = {
  negro: '#0D0D0D',
  amarillo: '#F5C518',
  rojo: '#D32027',
};

export default function SectionDivider({ from, to, flip = false }) {
  return (
    <div
      aria-hidden
      className="relative h-8 md:h-12 w-full overflow-hidden"
      style={{ backgroundColor: COLORS[from] }}
    >
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <polygon points={flip ? '0,10 100,0 100,10' : '0,0 100,10 0,10'} fill={COLORS[to]} />
      </svg>
    </div>
  );
}
