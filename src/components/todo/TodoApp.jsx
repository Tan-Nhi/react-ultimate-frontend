import TodoData from './TodoData'
import TodoNew from './TodoNew'
import reactLogo from '../../assets/react.svg'
import './todo.css'
import { useState } from 'react'


const TodoApp = () => {
    const [todoList, setTodolist] = useState([
        // { id: 1, name: "Learning React" },
        // { id: 2, name: "Watching youtube" }

    ])

    const addNewTodo = (name) => {
        const newTodo = {
            id: randomIntFromInterval(1, 1000000),
            name: name,
        }
        setTodolist([...todoList, newTodo])

    }

    const randomIntFromInterval = (min, max) => { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const deleteTodo = (id) => {
        const newTodo = todoList.filter(item => item.id !== id)
        setTodolist(newTodo)

    }

    //{key: value}
    return (
        <div className="todo-container">
            <div className="todo-title">Todo List</div>
            <TodoNew
                addNewTodo={addNewTodo}
            />

            {todoList.length > 0 ?
                <TodoData
                    todoList={todoList}
                    deleteTodo={deleteTodo}
                />
                :
                <div className="todo-image">
                    <img src={reactLogo} className='logo' />
                </div>
            }


            {/* {todoList.length > 0 &&
          <TodoData
            todoList={todoList}
          />
        }

        {todoList.length === 0 &&
          <div className="todo-image">
            <img src={reactLogo} className='logo' />
          </div>

        } */}

        </div>
    );
}

export default TodoApp;