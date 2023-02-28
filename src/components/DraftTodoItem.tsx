import React from 'react';

export function DraftTodoItem({ todo, todoActions, draftTodoActions }) {
  return (
    <li>
      <input
        style={{ width: '100%' }}
        placeholder="What needs doing?"
        value={todo.summary}
        onChange={(e) => {
          draftTodoActions.setDraftTodoSummary(todo, e.target.value);
        }}
      />

      <button
        onClick={async () => {
          await todoActions.saveTodo(todo);
          draftTodoActions.deleteDraftTodo(todo);
        }}
      >
        Save
      </button>
      <button
        onClick={() => {
          draftTodoActions.deleteDraftTodo(todo);
        }}
      >
        clear
      </button>
    </li>
  );
}
