import React from 'react';
import { ToDo, ToDoActions } from '../hooks/useTodos';

export function TodoItem({
  todo,
  todoActions,
}: {
  todo: ToDo;
  todoActions: ToDoActions;
}) {
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
