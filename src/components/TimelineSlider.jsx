export default function TimelineSlider({ years, selectedYear, onSelectYear }) {
  if (!years || years.length <= 1) return null;

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <div className="timeline-container">
      <div className="timeline-card">
        <div className="timeline-header">
          <span className="timeline-title">Timeline</span>
          <span className="timeline-badge">
            {selectedYear > maxYear ? 'All Visits' : selectedYear}
          </span>
        </div>
        <div className="slider-wrapper">
          <span className="year-mark">{minYear}</span>
          <input
            type="range"
            min={minYear}
            max={maxYear + 1}
            value={selectedYear}
            onChange={(e) => onSelectYear(Number(e.target.value))}
            className="timeline-range"
          />
          <span className="year-mark">All</span>
        </div>
      </div>
    </div>
  );
}