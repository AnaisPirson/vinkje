export default function TimelineSlider({ years, selectedYear, onSelectYear }) {
  if (!years || years.length <= 1) return null; // Only show if trips span multiple years

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <div className="timeline-container">
      <div className="timeline-card">
        <span className="timeline-label">
          {selectedYear === maxYear + 1 ? 'Showing: All Travels' : `Showing up to: ${selectedYear}`}
        </span>
        <div className="slider-wrapper">
          <span>{minYear}</span>
          <input
            type="range"
            min={minYear}
            max={maxYear + 1}
            value={selectedYear}
            onChange={(e) => onSelectYear(Number(e.target.value))}
            className="timeline-range"
          />
          <span>All</span>
        </div>
      </div>
    </div>
  );
}