import { useState, useEffect } from 'react';
import Map from './components/Map';
import Drawer from './components/Drawer';
import myTrips from './data/trips.json';

const FRIEND_PASSCODE = 'stroopwafel';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check URL on load for magic link: ?unlock=stroopwafel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === FRIEND_PASSCODE) {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlockPrompt = () => {
    const code = prompt('Enter your Friend Passcode:');
    if (code === FRIEND_PASSCODE) {
      setIsUnlocked(true);
      alert('✨ Friend Pass activated! Enjoy the photos.');
    } else if (code) {
      alert('Incorrect passcode!');
    }
  };

  // Find the trip data for whatever city is currently clicked
  const activeTrip = myTrips.find(
    (t) => selectedCity && t.municipality.toLowerCase() === selectedCity.toLowerCase()
  );

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Map onSelectCity={(city) => setSelectedCity(city)} />

      <Drawer
        selectedCity={selectedCity}
        trip={activeTrip}
        isUnlocked={isUnlocked}
        onUnlockRequest={handleUnlockPrompt}
        onClose={() => setSelectedCity(null)}
      />
    </main>
  );
}
