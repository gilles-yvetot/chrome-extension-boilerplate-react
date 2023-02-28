import React from 'react';

export function TodoItem({ todo, todoActions }) {
  return (
    <li>
      <input
        type="checkbox"
        color="primary"
        checked={todo.isComplete}
        onClick={() => {
          todoActions.toggleTodo(todo);
        }}
      />
      {todo.summary}
      <button
        onClick={() => {
          todoActions.deleteTodo(todo);
        }}
      >
        clear
      </button>
    </li>
  );
}
