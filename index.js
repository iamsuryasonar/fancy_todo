/* Selectors */

const input = document.getElementById('input_field')
const add_btn = document.getElementById('add_btn')
const todosDiv = document.querySelector('.todos')
const incompleteTodosDiv = document.querySelector('.incomplete_todos')
const completeTodosDiv = document.querySelector('.complete_todos')

/* Event listeners */

window.addEventListener('load', populateTodos)
add_btn.addEventListener('click', addTodo)
todosDiv.addEventListener('click', toggleAndDeleteTodo)

/* functions */

function populateTodos() {
    let todos = getTodoFromLocalStorage()
    todos?.incomplete && todos.incomplete.forEach((todo) => {
        createTodoDiv('incomplete', todo)
    })

    todos?.complete && todos.complete.forEach((todo) => {
        createTodoDiv('complete', todo)
    })
}

function addTodo() {
    let id = (Math.floor(Math.random() * 100) + Date.now() * Math.floor(Math.random() * 100)).toString().split('').splice(-8).join('')
    let todo = {
        id: id,
        value: input.value,
    }
    if (input.value !== '') {
        createTodoDiv('incomplete', todo)
        addTodoToLocalStorage(todo)
    }
    input.value = ''
}

function createTodoDiv(status, todo) {
    let todoCard = document.createElement('div')
    todoCard.className = `todo_card ${status}`;
    todoCard.innerHTML = `<p id=${todo.id}>${todo.value}</p><div class='buttons'><button id='toggle'>toggle</button><button id='delete'>delete</button></div>`
    if (status === 'incomplete') {
        incompleteTodosDiv.appendChild(todoCard)
    }
    if (status === 'complete') {
        completeTodosDiv.appendChild(todoCard)
    }
}

function toggleAndDeleteTodo(e) {
    let status;
    const group_class = e.target.parentNode.parentNode.parentNode.classList[0]

    if (group_class === 'complete_todos') {
        status = 'complete'
    }

    if (group_class === 'incomplete_todos') {
        status = 'incomplete'
    }

    const todoId = e.target.parentNode.parentNode.querySelector('p').id

    let value = e.target.parentNode.parentNode.children[0].textContent

    let todo = {
        id: todoId,
        value
    }

    if (e.target.id === 'toggle') {

        toggleTodoStatus(status, todo);

        if (status === 'incomplete') {
            createTodoDiv('complete', todo)
        }
        if (status === 'complete') {
            createTodoDiv('incomplete', todo)
        }
    } else if (e.target.id === 'delete') {
        removeTodoFromLocalStorage(status, todo)
    } else {
        return;
    }

    e.target.parentNode.parentNode.remove()
}

/* Local storage */
function getTodoFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todo'))
}

function addTodoToLocalStorage(todo) {
    let parsedTodos = getTodoFromLocalStorage()
    let obj;
    if (!parsedTodos) {
        obj = {
            complete: [],
            incomplete: [todo],
        }
    } else {
        obj = {
            complete: parsedTodos?.complete ? [...parsedTodos?.complete] : [],
            incomplete: parsedTodos?.incomplete ? [...parsedTodos?.incomplete, todo] : [],
        }
    }

    localStorage.setItem('todo', JSON.stringify(obj))
}

function toggleTodoStatus(status, todo) {
    let parsedTodos = getTodoFromLocalStorage()
    if (!parsedTodos) return;

    let newTodos = {
        complete: [],
        incomplete: []
    }

    if (status === 'incomplete') {

        newTodos.incomplete = parsedTodos.incomplete.filter((item) => {
            return item.id !== todo.id
        })
        newTodos.complete = [...parsedTodos.complete, todo]

    } else if (status === 'complete') {

        newTodos.complete = parsedTodos.complete.filter((item) => {
            return item.id !== todo.id
        })
        newTodos.incomplete = [...parsedTodos.incomplete, todo]
    }

    localStorage.setItem('todo', JSON.stringify(newTodos));
}

function removeTodoFromLocalStorage(status, todo) {
    let parsedTodos = getTodoFromLocalStorage()
    if (!parsedTodos) return;

    let newTodos = {
        complete: [],
        incomplete: []
    }

    if (status === 'incomplete') {
        newTodos.incomplete = parsedTodos.incomplete.filter((item) => {
            return item.id !== todo.id
        })
        newTodos.complete = parsedTodos.complete
    }

    if (status === 'complete') {
        newTodos.complete = parsedTodos.complete.filter((item) => {
            return item.id !== todo.id
        })
        newTodos.incomplete = parsedTodos.incomplete
    }
    localStorage.setItem('todo', JSON.stringify(newTodos))
}