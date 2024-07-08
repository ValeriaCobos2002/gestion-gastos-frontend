document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');
    const loginContainer = document.getElementById('login-container');
    const expensesContainer = document.getElementById('expenses-container');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:5051/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                loginContainer.style.display = 'none';
                expensesContainer.style.display = 'block';
                loadExpenses();
            } else {
                alert('Login failed');
            }
        });
    });

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = document.getElementById('amount').value;
        const reason = document.getElementById('reason').value;
        const token = localStorage.getItem('token');

        fetch('http://localhost:5051/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, reason })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadExpenses();
            } else {
                alert('Failed to register expense');
            }
        });
    });

    function loadExpenses() {
        const token = localStorage.getItem('token');

        fetch('http://localhost:5051/api/expenses', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            expensesList.innerHTML = '';
            data.forEach(expense => {
                const li = document.createElement('li');
                li.textContent = `Monto: ${expense.amount}, Razón: ${expense.reason}`;
                expensesList.appendChild(li);
            });
        });
    }
});
