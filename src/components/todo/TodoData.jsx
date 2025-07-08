const TodoData = (props) => {
    //props là 1 biến object {}
    const { todoList, deleteTodo } = props;

    const handClickDelete = (id) => {
        deleteTodo(id);
    }
    return (
        <div className="todo-data">
            {todoList.map(item => {
                return (
                    <div className={`todo-item`} key={item.id}>
                        <div>{item.name}</div>
                        <button
                            style={{ cursor: "pointer" }}
                            onClick={() => handClickDelete(item.id)}
                        >Delete</button>
                    </div>
                )
            })}
        </div>
    );
}

export default TodoData;