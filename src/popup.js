document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const taskInput = document.getElementById('task');
    const taskList = document.getElementById('task-list');

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                ${taskText}
                <button class="delete-task">Sil</button>
            `;
            taskList.appendChild(li);
            taskInput.value = '';

            const deleteButton = li.querySelector('.delete-task');
            deleteButton.addEventListener('click', () => {
                taskList.removeChild(li);
            });
        }
    });
}); 