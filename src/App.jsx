import { useState, useEffect, useRef } from 'react';
import { useTimeStore } from './state/time-store.js';
import { formatDuration } from './utils/time.js';
import Datetime from 'react-datetime';
import moment from 'moment';
import CreatableSelect from 'react-select/creatable';

function App() {
  const { entries, startTime, isRunning, startTimer, stopTimer, addManualEntry, getUniqueProjectIds } = useTimeStore();

  const [start, setStart] = useState(moment());
  const [durationInMinutes, setDurationInMinutes] = useState("30");
  const selectProjectIdsRef = useRef();
  const uniqueProjectIds = getUniqueProjectIds();

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = window.setInterval(() => useTimeStore.getState().tick(), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  console.log("entries: ", entries);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Work Hour Tracker</h1>
      <div className="mb-4">
        {isRunning ? (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={stopTimer}
          >
            Stop Timer
          </button>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={startTimer}
          >
            Start Timer
          </button>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <label className="block">
          <span className="text-gray-700">Start Time</span>
          <Datetime
            value={start}
            onChange={(date) => setStart(date)}
            dateFormat="YYYY-MM-DD"
            timeFormat="HH:mm"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Duration (minutes)</span>
          <input
            type="number"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            value={durationInMinutes}
            onChange={(e) => setDurationInMinutes(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Projects</span>
          <CreatableSelect options={uniqueProjectIds} isMulti ref={selectProjectIdsRef} />
        </label>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() =>
            addManualEntry(new Date(start).getTime(), parseInt(durationInMinutes, 10) * 60, selectProjectIdsRef.current.getValue().map(option => option.value), [])
          }
        >
          Add Entry
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Time Entries</h2>
      <ul className="bg-white p-4 rounded shadow">
        {entries.map((entry, i) => (
          <li key={i} className="border-b py-2">
            {new Date(entry.start).toLocaleString()} — {formatDuration(entry.duration)} — {entry.projectIds?.join(' ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
