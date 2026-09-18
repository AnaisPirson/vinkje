import { useState, useEffect } from 'react';
import Map from './components/Map';
import Drawer from './components/Drawer';
import Header from './components/Header';
import TimelineSlider from './components/TimelineSlider';
import authorTripsData from './data/trips.json';

const FRIEND_PASSCODE = 'stroopwafel';

export default function App() {
  const [mode, setMode] = useState('author'); // 'author' or 'personal'
  const [personalTrips, setPersonalTrips] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timelineYear, setTimelineYear] = useState(3000); // 3000 = Show all

  // 1. Load localStorage and magic link on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === FRIEND_PASSCODE) setIsUnlocked(true);

    const saved = localStorage.getItem('vinkje_personal_trips');
    if (saved) setPersonalTrips(JSON.parse(saved));
  }, []);

  const handleUnlockPrompt = () => {
    const code = prompt('Enter your Friend Passcode:');
    if (code === FRIEND_PASSCODE) {
      setIsUnlocked(true);
      alert('✨ Friend Pass activated!');
    } else if (code) {
      alert('Incorrect passcode!');
    }
  };

  // Add trip in Personal Mode
  const handleSavePersonalTrip = (newTrip) => {
    const updated = [...personalTrips, newTrip];
    setPersonalTrips(updated);
    localStorage.setItem('vinkje_personal_trips', JSON.stringify(updated));
  };

  // Switch between author and personal dataset
  const activeDataset = mode === 'author' ? authorTripsData : personalTrips;

  // Extract years from trip dates for the Timeline slider
  const years = Array.from(
    new Set(
      activeDataset
        .map((t) => {
          const match = t.date.match(/\d{4}/);
          return match ? Number(match[0]) : null;
        })
        .filter(Boolean)
    )
  );

  const maxYear = years.length > 0 ? Math.max(...years) : 2024;

  // Filter trips by timeline slider
  const filteredTrips = activeDataset.filter((t) => {
    if (timelineYear > maxYear) return true; // Show all
    const match = t.date.match(/\d{4}/);
    return match ? Number(match[0]) <= timelineYear : true;
  });

  const activeTrip = filteredTrips.find(
    (t) => selectedCity && t.municipality.toLowerCase() === selectedCity.toLowerCase()
  );

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header
        mode={mode}
        setMode={(newMode) => {
          setMode(newMode);
          setSelectedCity(null);
        }}
        visitedCount={filteredTrips.length}
        isUnlocked={isUnlocked}
        onUnlockRequest={handleUnlockPrompt}
      />

      <Map trips={filteredTrips} onSelectCity={(city) => setSelectedCity(city)} />

      <TimelineSlider
        years={years}
        selectedYear={timelineYear > maxYear ? maxYear + 1 : timelineYear}
        onSelectYear={(yr) => setTimelineYear(yr)}
      />

      <Drawer
        selectedCity={selectedCity}
        trip={activeTrip}
        isUnlocked={isUnlocked}
        mode={mode}
        onSavePersonalTrip={handleSavePersonalTrip}
        onUnlockRequest={handleUnlockPrompt}
        onClose={() => setSelectedCity(null)}
      />
    </main>
  );
}