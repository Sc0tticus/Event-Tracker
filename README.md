# Days Until

A web application that helps you track upcoming events and count down the days until they occur.

## Features

- Add events with name, date, and time
- View countdown in days or hours (automatically switches to hours when less than 24 hours away)
- Edit existing events
- Delete events
- Persistent storage using MongoDB
- Responsive design that works on desktop and mobile

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB
- Styling: CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/days-until-date.git
cd days-until-date
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
MONGODB_URI=mongodb://localhost:27017/days-until
PORT=5000
```

4. Start the development servers:
```bash
# Start the backend server
cd backend
npm run dev

# In a new terminal, start the frontend
cd ..
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Add a new event by entering:
   - Event name
   - Date
   - Time
2. View your events with countdown timers
3. Edit or delete events as needed
4. Events are automatically saved to the database

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
