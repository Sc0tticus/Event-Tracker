import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '12:00'
  })
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      
      // Sort events by date and time, closest to today first
      const sortedEvents = data.sort((a, b) => {
        const today = new Date()
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        
        // If event has passed, put it at the end
        if (dateA < today && dateB < today) {
          return dateB - dateA // Most recent past events first
        }
        if (dateA < today) return 1 // Past events go to the end
        if (dateB < today) return -1
        
        return dateA - dateB // Future events sorted by date
      })
      
      setEvents(sortedEvents)
      setError(null)
    } catch (err) {
      setError('Failed to load events. Please try again later.')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateTimeUntil = (eventDate, eventTime) => {
    const today = new Date()
    const [hours, minutes] = eventTime.split(':')
    const [year, month, day] = eventDate.split('-')
    const event = new Date(year, month - 1, day, hours, minutes)
    const diffTime = event - today
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (diffDays < 0) {
      return 'Event has passed'
    } else if (diffDays === 0) {
      if (diffHours <= 0) {
        return 'Event is happening now'
      }
      return `${diffHours} hours until`
    } else {
      return `${diffDays} days until`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newEvent.name && newEvent.date) {
      try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        })
        if (!response.ok) throw new Error('Failed to add event')
        const savedEvent = await response.json()
        setEvents([...events, savedEvent])
        setNewEvent({ name: '', date: '', time: '12:00' })
        setError(null)
      } catch (err) {
        setError('Failed to add event. Please try again.')
        console.error('Error adding event:', err)
      }
    }
  }

  const handleEdit = async (event) => {
    try {
      const formattedEvent = {
        ...event,
        date: new Date(event.date).toISOString().split('T')[0]
      };
      
      const response = await fetch(`${API_URL}/events/${event._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedEvent),
      })
      if (!response.ok) throw new Error('Failed to update event')
      const updatedEvent = await response.json()
      setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e))
      setEditingEvent(null)
      setError(null)
    } catch (err) {
      setError('Failed to update event. Please try again.')
      console.error('Error updating event:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete event')
      setEvents(events.filter(event => event._id !== id))
      setError(null)
    } catch (err) {
      setError('Failed to delete event. Please try again.')
      console.error('Error deleting event:', err)
    }
  }

  const formatDateTime = (date, time) => {
    const [hours, minutes] = time.split(':')
    const [year, month, day] = date.split('-')
    const eventDate = new Date(year, month - 1, day, hours, minutes)
    return eventDate.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="app">Loading...</div>
  }

  return (
    <div className="app">
      <h1>Days Until</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="event-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <button type="submit">Add Event</button>
        </form>
      </div>
      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            {editingEvent?._id === event._id ? (
              <form onSubmit={(e) => { e.preventDefault(); handleEdit(editingEvent); }}>
                <input
                  type="text"
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                />
                <input
                  type="date"
                  value={new Date(editingEvent.date).toISOString().split('T')[0]}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                />
                <input
                  type="time"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                />
                <div className="edit-buttons">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingEvent(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h3>{event.name}</h3>
                <p>Date & Time: {formatDateTime(event.date, event.time)}</p>
                <p>{calculateTimeUntil(event.date, event.time)}</p>
                <div className="event-buttons">
                  <button onClick={() => setEditingEvent(event)}>Edit</button>
                  <button onClick={() => handleDelete(event._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
