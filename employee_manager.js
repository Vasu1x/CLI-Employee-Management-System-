const readline = require('readline');

// --- In-Memory Data Store ---
const employees = [
    // Pre-populate with data matching the expected output scenario
    { name: 'Alice', id: 'E101' },
    { name: 'Bob', id: 'E102' },
    { name: 'Charlie', id: 'E103' }
];

// --- Readline Interface Setup ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// --- Core Functions ---

/**
 * Displays the main menu and prompts for user choice.
 */
function showMenu() {
    console.log('\nEmployee Management System');
    console.log('1. Add Employee');
    console.log('2. List Employees');
    console.log('3. Remove Employee');
    console.log('4. Exit');
    rl.question('\nEnter your choice: ', handleChoice);
}

/**
 * Handles the user's menu choice.
 * @param {string} choice - The user's input choice.
 */
function handleChoice(choice) {
    switch (choice.trim()) {
        case '1':
            addEmployee();
            break;
        case '2':
            listEmployees();
            break;
        case '3':
            removeEmployee();
            break;
        case '4':
            rl.close();
            break;
        default:
            console.log('\n❌ Invalid choice. Please enter a number between 1 and 4.');
            showMenu();
            break;
    }
}

// --- Menu Actions ---

/**
 * Prompts user for name and ID to add a new employee.
 */
function addEmployee() {
    rl.question('Enter employee name: ', (name) => {
        rl.question('Enter employee ID: ', (id) => {
            const trimmedName = name.trim();
            const trimmedId = id.trim();

            if (!trimmedName || !trimmedId) {
                console.log('❌ Error: Name and ID cannot be empty.');
                return showMenu();
            }

            // Check for ID duplication
            if (employees.some(emp => emp.id === trimmedId)) {
                console.log(`❌ Error: Employee with ID ${trimmedId} already exists.`);
                return showMenu();
            }

            employees.push({ name: trimmedName, id: trimmedId });
            console.log(`Employee ${trimmedName} (ID: ${trimmedId}) added successfully.`);
            showMenu();
        });
    });
}

/**
 * Lists all employees currently in the array.
 */
function listEmployees() {
    console.log('\nEmployee List:');
    if (employees.length === 0) {
        console.log('ℹ️ The employee list is empty.');
    } else {
        employees.forEach((employee, index) => {
            console.log(`${index + 1}. Name: ${employee.name}, ID: ${employee.id}`);
        });
    }
    showMenu();
}

/**
 * Prompts user for an ID to remove a matching employee.
 */
function removeEmployee() {
    rl.question('Enter employee ID to remove: ', (idToRemove) => {
        const index = employees.findIndex(emp => emp.id === idToRemove.trim());

        if (index === -1) {
            console.log(`❌ Error: Employee with ID ${idToRemove.trim()} not found.`);
        } else {
            const removedEmployee = employees.splice(index, 1)[0];
            console.log(`Employee ${removedEmployee.name} (ID: ${removedEmployee.id}) removed successfully.`);
        }
        showMenu();
    });
}

// --- Application Start and Exit ---

// Handle the application exit event
rl.on('close', () => {
    console.log('\n👋 Exiting Employee Management CLI. Goodbye!');
    process.exit(0);
});

// Start the application
showMenu();