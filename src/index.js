import TaskManager from './tasks.js';
import Calendar from './calendar.js';

// Initialize Task Manager
const taskManager = new TaskManager();

// Initialize Calendar
const calendar = new Calendar();

// Event Listeners
document.getElementById('tasks').addEventListener('click', () => {
    taskManager.showTasksPanel();
});

document.getElementById('calendar').addEventListener('click', () => {
    calendar.showCalendar();
}); 