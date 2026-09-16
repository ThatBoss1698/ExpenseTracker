/** This is a simple expense tracker script. This script handles adding expenses and displaying them in a list. */

// Get references to the form and the expense list
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalExpensesSpan = document.getElementById('total-expenses');

// Function to store local memory of expenses

function storeExpenses(expenseName, expenseAmount, expenseDate) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ name: expenseName, amount: expenseAmount, date: expenseDate });
    localStorage.setItem('expenses', JSON.stringify(expenses));

}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenses.forEach(expense => {
        const expenseItem = document.createElement('li');
        expenseItem.textContent = `${expense.name} : $${expense.amount} (${expense.date})`;
        expenseList.appendChild(expenseItem);
        createCheckboxes(); // Apply checkbox style to the new item
    });
    updateTotalExpenses();
}

// Function to add an expense to the list
function addExpense(event) {
    event.preventDefault(); // Prevent the form from submitting


    // Get the values from the form inputs
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = document.getElementById('expense-amount').value;
    const expenseDate = document.getElementById('expense-date').value;

    // Create a new list item for the expense
    const expenseItem = document.createElement('li');
    expenseItem.textContent = `${expenseName} : $${expenseAmount} (${expenseDate})`;

    for (let i = 0; i < expenseList.children.length; i++) {
        const [name, amount, date] = expenseList.children[i].textContent.split(') $');
        if (expenseName === name) {
            alert('This expense already exists in the list.');
            return; // Exit the function if the expense already exists
        }
    }



    // Add the expense item to the list
    expenseList.appendChild(expenseItem);
    createCheckboxes(); // Apply checkbox style to the new item
    updateTotalExpenses();

    // Clear the form inputs
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-date').value = '';
    storeExpenses(expenseName, expenseAmount, expenseDate); // Store the expense in local storage
}

// Function to grab, modify and save back localStorage expenses
function updateLocalStorage() {
    const expenses = [];
    const expenseItems = expenseList.getElementsByTagName('li');

    for (let i = 0; i < expenseItems.length; i++) {
        const expenseText = expenseItems[i].textContent;
        const [name, amount, date] = expenseText.split(') $');
        expenses.push({ name, date, amount: parseFloat(amount) });
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to update the total expenses displayed
function updateTotalExpenses() {
    let total = 0;
    const expenses = expenseList.getElementsByTagName('li');

    for (let i = 0; i < expenses.length; i++) {
        const expenseText = expenses[i].textContent;
        const amount = parseFloat(expenseText.split('$')[1]);
        const date = expenseText.split('(')[1].split(')')[0]; // Extract the date from the text
        total += amount;
    }

    totalExpensesSpan.textContent = total.toFixed(2);
    totalExpensesSpan.style.color = total > 1000 ? 'red' : 'white'; // Change color if total exceeds $1000
}
// Function to delete selected expenses from the list
function deleteExpense(event) {
    const checkbox = document.querySelectorAll('.expense-checkbox:checked');
    let i;
        for ( i = 0; i < checkbox.length; i++) {
            const expenseItem = checkbox[i].parentElement;
            expenseList.removeChild(expenseItem);
            updateLocalStorage(); // Update local storage after deletion
        updateTotalExpenses();
    }
}
// Function to create checkboxes for each expense item
function createCheckboxes() {
    const expenses = expenseList.getElementsByTagName('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'expense-checkbox';
        const expenseItem = expenses[expenses.length - 1]; // Get the last added expense item
        expenseItem.insertBefore(checkbox, expenseItem.firstChild);
    
}
/**                                  Event Listeners                             */


// Add an event listener to the form to handle submission
expenseForm.addEventListener('submit', addExpense);

// Add an event listener to the delete button
document.getElementById('delete-expenses').addEventListener('click', deleteExpense);

// Add event listeners to the clear and delete buttons
document.getElementById('clear-expenses').addEventListener('click', () => {
    expenseList.innerHTML = '';
    localStorage.removeItem('expenses');
    updateTotalExpenses();
});

/**                                     Main code                       */
loadExpenses(); // Load stored expenses when the page loads    