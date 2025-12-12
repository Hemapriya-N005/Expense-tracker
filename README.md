# Expense Tracker

A full-stack web application for managing personal expenses with CRUD operations. Built with Node.js, Express, and MongoDB with a responsive frontend interface.

## Features

- Add new expenses with description, amount, and category
- View all expenses in a responsive table
- Edit existing expense details
- Delete expenses
- Real-time calculation of total expenses
- Responsive design that works on desktop and mobile devices

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM (fallback to in-memory storage)
- **Frontend**: HTML, CSS, JavaScript
- **API**: RESTful API design

## Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── public/            # Static files directory
│       ├── index.html     # Main page
│       ├── styles.css     # Styling
│       └── script.js      # Client-side logic
├── frontend/              # Development files
│   ├── index.html
│   ├── styles.css
│   └── script.js
```

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (for persistent storage, optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hemapriya-N005/Expense-tracker.git
   cd Expense-tracker
   ```

2. Navigate to the backend directory:
   ```bash
   cd expense-tracker/backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:
   ```bash
   node server.js
   ```

2. Open your browser and visit:
   ```
   http://localhost:8000
   ```

## Database Configuration

The application uses MongoDB for persistent storage. If MongoDB is not available, it falls back to in-memory storage.

To use MongoDB:

1. Install MongoDB on your system
2. Start the MongoDB service
3. The application will automatically connect to MongoDB at `mongodb://localhost:27017/expenseTracker`

## API Endpoints

- `GET /api/expenses` - Retrieve all expenses
- `GET /api/expenses/:id` - Retrieve a specific expense
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an existing expense
- `DELETE /api/expenses/:id` - Delete an expense

## License

This project is licensed under the MIT License.

## Author

[Hemapriya-N005](https://github.com/Hemapriya-N005)