class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.todoInput = document.querySelector('.todo-input');
        this.addBtn = document.querySelector('.add-btn');
        this.todoList = document.querySelector('.todo-list');
        this.statsText = document.querySelector('.stats-text');
        this.clearBtn = document.querySelector('.clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.clearBtn.addEventListener('click', () => this.clearCompleted());
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        this.render();
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.save();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.save();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.save();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <div class="todo-content">
                    <input type="checkbox" class="todo-checkbox" id="todo-${todo.id}" 
                           ${todo.completed ? 'checked' : ''} 
                           onchange="app.toggleTodo(${todo.id})">
                    <label for="todo-${todo.id}" class="todo-text">${todo.text}</label>
                </div>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">×</button>
            </li>
        `).join('');

        const activeCount = this.todos.filter(todo => !todo.completed).length;
        this.statsText.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});