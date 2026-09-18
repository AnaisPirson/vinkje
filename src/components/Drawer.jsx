import { useState } from 'react';

export default function Drawer({ 
  selectedCity, 
  trip, 
  isUnlocked, 
  mode, 
  onSavePersonalTrip, 
  onUnlockRequest, 
  onClose 
}) {
  if (!selectedCity) return null;

  const [date, setDate] = useState('');
  const [hotel, setHotel] = useState('');
  const [notes, setNotes] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSavePersonalTrip({
      municipality: selectedCity,
      date: date || 'Recently visited',
      hotel: hotel || 'Personal Stay',
      notes: notes || 'No notes added.',
      photos: []
    });
  };

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

          {isUnlocked || mode === 'personal' ? (
            <div className="unlocked-content">
              <div className="section">
                <h4>Stayed at</h4>
                <p className="hotel-name">🏨 {trip.hotel}</p>
              </div>

              <div className="section">
                <h4>Highlights & Notes</h4>
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
            <div className="locked-box">
              <span className="lock-icon">🔒</span>
              <h3>Travel Memories Locked</h3>
              <p>Hotel stays, personal notes, and photo galleries are private.</p>
              <button className="unlock-action-btn" onClick={onUnlockRequest}>
                Have a Friend Pass?
              </button>
            </div>
          )}
        </div>
      ) : mode === 'personal' ? (
        /* Form for users to scratch off their own trips */
        <form className="personal-log-form" onSubmit={handleFormSubmit}>
          <p className="form-intro">You haven't scratched this off yet! Add your stay to unlock it.</p>

          <label>When did you visit?</label>
          <input 
            type="text" 
            placeholder="e.g. Summer 2023" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />

          <label>Where did you stay?</label>
          <input 
            type="text" 
            placeholder="e.g. Hotel V, Airbnb, Camping" 
            value={hotel} 
            onChange={(e) => setHotel(e.target.value)} 
          />

          <label>Memories & Notes:</label>
          <textarea 
            placeholder="What was your favorite moment?" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />

          <button type="submit" className="scratch-btn">
            🍊 Scratch Off & Save!
          </button>
        </form>
      ) : (
        <div className="empty-state">
          <p>The author hasn't visited {selectedCity} yet.</p>
          <p className="hint">Switch to "My Scratch Map" above to start logging your own!</p>
        </div>
      )}
    </aside>
  );
}