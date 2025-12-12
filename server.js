const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

// Expense data storage - fallback to in-memory if MongoDB not available
let useMongoDB = false;
let expenses = [
  { id: '1', description: 'Groceries', amount: 50.50, category: 'Food' },
  { id: '2', description: 'Gas', amount: 40.00, category: 'Transportation' },
  { id: '3', description: 'Movie tickets', amount: 30.00, category: 'Entertainment' }
];
let nextId = 4;

// Try to connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expenseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  useMongoDB = true;
  
  // Expense Schema
  const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    category: String,
    date: {
      type: Date,
      default: Date.now
    }
  });

  Expense = mongoose.model('Expense', expenseSchema);
})
.catch(err => {
  console.log('Failed to connect to MongoDB, using in-memory storage');
  console.log('To use MongoDB, please install and start MongoDB server');
  useMongoDB = false;
});

let Expense; // Will be defined if MongoDB connection succeeds

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    if (useMongoDB) {
      const expenses = await Expense.find();
      res.json(expenses);
    } else {
      res.json(expenses);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get a specific expense by ID
app.get('/api/expenses/:id', async (req, res) => {
  try {
    if (useMongoDB) {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.json(expense);
    } else {
      const expense = expenses.find(expense => expense.id === req.params.id);
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.json(expense);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// Add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    
    if (!description || !amount || !category) {
      return res.status(400).json({ error: 'Description, amount, and category are required' });
    }
    
    if (useMongoDB) {
      const newExpense = new Expense({
        description,
        amount: parseFloat(amount),
        category
      });
      
      const savedExpense = await newExpense.save();
      res.status(201).json(savedExpense);
    } else {
      const newExpense = {
        id: String(nextId++),
        description,
        amount: parseFloat(amount),
        category
      };
      
      expenses.push(newExpense);
      res.status(201).json(newExpense);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update an expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    
    if (!description || !amount || !category) {
      return res.status(400).json({ error: 'Description, amount, and category are required' });
    }
    
    if (useMongoDB) {
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        {
          description,
          amount: parseFloat(amount),
          category
        },
        { new: true }
      );
      
      if (!updatedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      res.json(updatedExpense);
    } else {
      const expenseIndex = expenses.findIndex(expense => expense.id === req.params.id);
      
      if (expenseIndex === -1) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      expenses[expenseIndex] = {
        id: req.params.id,
        description,
        amount: parseFloat(amount),
        category
      };
      
      res.json(expenses[expenseIndex]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    if (useMongoDB) {
      const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
      
      if (!deletedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      res.status(204).send();
    } else {
      const expenseIndex = expenses.findIndex(expense => expense.id === req.params.id);
      
      if (expenseIndex === -1) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      expenses.splice(expenseIndex, 1);
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
  if (!useMongoDB) {
    console.log('Using in-memory storage. Data will be lost when server restarts.');
    console.log('To use MongoDB, please install and start MongoDB server.');
  }
});