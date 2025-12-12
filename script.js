// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseIdInput = document.getElementById('expense-id');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const expensesList = document.getElementById('expenses-list');
const totalAmount = document.getElementById('total-amount');

// State
let isEditing = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
});

expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const expenseData = {
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        category: categoryInput.value
    };
    
    if (isEditing) {
        const id = expenseIdInput.value;
        await updateExpense(id, expenseData);
    } else {
        await addExpense(expenseData);
    }
    
    resetForm();
    loadExpenses();
});

cancelBtn.addEventListener('click', () => {
    resetForm();
});

// Functions
async function loadExpenses() {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses`);
        const expenses = await response.json();
        
        renderExpenses(expenses);
        calculateTotal(expenses);
    } catch (error) {
        console.error('Error loading expenses:', error);
        alert('Failed to load expenses');
    }
}

function renderExpenses(expenses) {
    expensesList.innerHTML = '';
    
    if (expenses.length === 0) {
        expensesList.innerHTML = '<tr><td colspan="4">No expenses found</td></tr>';
        return;
    }
    
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${expense.id}">Edit</button>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            </td>
        `;
        
        expensesList.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editExpense(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteExpense(id);
        });
    });
}

function calculateTotal(expenses) {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total.toFixed(2);
}

async function addExpense(expenseData) {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add expense');
        }
        
        alert('Expense added successfully!');
    } catch (error) {
        console.error('Error adding expense:', error);
        alert(`Error: ${error.message}`);
    }
}

async function editExpense(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${id}`);
        const expense = await response.json();
        
        // Populate form with expense data
        expenseIdInput.value = expense.id;
        descriptionInput.value = expense.description;
        amountInput.value = expense.amount;
        categoryInput.value = expense.category;
        
        // Switch to edit mode
        isEditing = true;
        submitBtn.textContent = 'Update Expense';
        cancelBtn.style.display = 'inline-block';
    } catch (error) {
        console.error('Error fetching expense:', error);
        alert('Failed to load expense for editing');
    }
}

async function updateExpense(id, expenseData) {
    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update expense');
        }
        
        alert('Expense updated successfully!');
    } catch (error) {
        console.error('Error updating expense:', error);
        alert(`Error: ${error.message}`);
    }
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete expense');
        }
        
        alert('Expense deleted successfully!');
        loadExpenses();
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert(`Error: ${error.message}`);
    }
}

function resetForm() {
    expenseForm.reset();
    expenseIdInput.value = '';
    isEditing = false;
    submitBtn.textContent = 'Add Expense';
    cancelBtn.style.display = 'none';
}