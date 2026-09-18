export default function Header({ 
  mode, 
  setMode, 
  visitedCount, 
  totalCount = 342, 
  isUnlocked, 
  onUnlockRequest 
}) {
  const percentage = ((visitedCount / totalCount) * 100).toFixed(1);

  return (
    <header className="header">
      {/* Left: Stats */}
      <div className="header-left">
        <div className="stats-pill">
          <span className="stats-count">{visitedCount}</span> / {totalCount} visited ({percentage}%)
        </div>
      </div>

      {/* Center: Title */}
      <div className="header-center">
        <h1 className="brand">📌 Vinkje <span className="flag">🇳🇱</span></h1>
      </div>

      {/* Right: Controls */}
      <div className="header-right">
        <div className="mode-switch">
          <button 
            className={mode === 'author' ? 'active' : ''} 
            onClick={() => setMode('author')}
          >
            Author's Trips
          </button>
          <button 
            className={mode === 'personal' ? 'active' : ''} 
            onClick={() => setMode('personal')}
          >
            My Map
          </button>
        </div>

        {mode === 'author' && (
          isUnlocked ? (
            <span className="unlocked-badge">✨ Friend View</span>
          ) : (
            <button className="unlock-header-btn" onClick={onUnlockRequest}>
              🔒 Friend Pass
            </button>
          )
        )}
      </div>
    </header>
  );
}