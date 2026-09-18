export default function Drawer({ selectedCity, trip, isUnlocked, onUnlockRequest, onClose }) {
  if (!selectedCity) return null;

  return (
    <aside className="drawer">
      <button className="close-btn" onClick={onClose}>✕</button>

      <div className="drawer-header">
        <span className="badge">{trip ? '🍊 Visited' : 'Unexplored'}</span>
        <h2>{selectedCity}</h2>
      </div>

      {trip ? (
        <div className="trip-details">
          <p className="trip-date">🗓 {trip.date}</p>

          {/* If friend unlocked: Show the goods! */}
          {isUnlocked ? (
            <div className="unlocked-content">
              <div className="section">
                <h4>Stayed at</h4>
                <p className="hotel-name">🏨 {trip.hotel}</p>
              </div>

              <div className="section">
                <h4>Trip Highlights & Notes</h4>
                <p className="notes">{trip.notes}</p>
              </div>

              {trip.photos && trip.photos.length > 0 && (
                <div className="section">
                  <h4>Photos ({trip.photos.length})</h4>
                  <div className="photo-gallery">
                    {trip.photos.map((url, i) => (
                      <img key={i} src={url} alt={`Memory in ${selectedCity}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* If public/recruiter view: Show privacy lock */
            <div className="locked-box">
              <span className="lock-icon">🔒</span>
              <h3>Travel Memories Locked</h3>
              <p>Hotel recommendations, personal notes, and photo galleries are private.</p>
              <button className="unlock-action-btn" onClick={onUnlockRequest}>
                Have a Friend Pass?
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't scratched this municipality off yet!</p>
        </div>
      )}
    </aside>
  );
}