import React from 'react';
import EventsList from '../components/EventsList';

export default function EventsPage() {
  return (
    <div>
      <h2 className="mt-4 ms-3">Events</h2>
      <EventsList />
    </div>
  );
}
