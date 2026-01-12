// После объявления массива tasks, добавьте:

// Сохранение задач в LocalStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('teamTasks', JSON.stringify(tasks));
    console.log('Задачи сохранены в LocalStorage');
}

// Загрузка задач из LocalStorage
function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('teamTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        console.log('Задачи загружены из LocalStorage');
    }
}

// Обновленная функция initApp
function initApp() {
    loadTasksFromLocalStorage(); // Загружаем сохраненные задачи
    renderTasks();
    setupEventListeners();
    updateTaskCounters();
}

// Обновленные функции, которые изменяют задачи (добавляем вызов saveTasksToLocalStorage)
function addTask(text, assignee, dueDate, status) {
    const newTask = {
        id: Date.now(),
        text,
        assignee,
        dueDate,
        status
    };
    
    tasks.push(newTask);
    saveTasksToLocalStorage(); // Сохраняем после добавления
    renderTasks();
    resetForm();
}

function deleteTask(id) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToLocalStorage(); // Сохраняем после удаления
        renderTasks();
    }
}

function moveTask(id, direction) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    let newStatus = task.status;
    
    if (direction === 'left') {
        if (task.status === 'in-progress') newStatus = 'todo';
        else if (task.status === 'done') newStatus = 'in-progress';
    } else if (direction === 'right') {
        if (task.status === 'todo') newStatus = 'in-progress';
        else if (task.status === 'in-progress') newStatus = 'done';
    }
    
    tasks[taskIndex].status = newStatus;
    saveTasksToLocalStorage(); // Сохраняем после перемещения
    renderTasks();
}

// Обновите также обработчик drop для drag and drop
column.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('over');
    
    if (!draggedTask) return;
    
    const columnId = this.parentElement.id;
    let newStatus = 'todo';
    
    if (columnId === 'in-progress-column') newStatus = 'in-progress';
    else if (columnId === 'done-column') newStatus = 'done';
    
    const taskIndex = tasks.findIndex(task => task.id === draggedTask.id);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveTasksToLocalStorage(); // Сохраняем после перетаскивания
        renderTasks();
    }
});
