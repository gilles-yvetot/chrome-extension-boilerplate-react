import React from 'react';

import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { useDraftTodos } from '../hooks/useDraftTodos';
import { DraftTodoItem } from './DraftTodoItem';
import { useShowLoader } from '../hooks/util-hooks';
import { MoreInfo } from './MoreInfo';

export function TodoItemsPage() {
  const { loading, todos, ...todoActions } = useTodos();
  const { draftTodos, ...draftTodoActions } = useDraftTodos();
  const showLoader = useShowLoader(loading, 200);
  return (
    <div className="main-container">
      {loading ? (
        showLoader ? (
          `loading...`
        ) : null
      ) : (
        <div className="todo-items-container">
          <h5>
            {`You have ${todos.length} To-Do Item${
              todos.length === 1 ? '' : 's'
            }`}
          </h5>
          <button
            color="primary"
            onClick={() => draftTodoActions.createDraftTodo()}
          >
            Add To-Do
          </button>
          <li style={{ width: '100%' }}>
            {todos.map((todo) => (
              <TodoItem
                key={String(todo._id)}
                todo={todo}
                todoActions={todoActions}
              />
            ))}
            {draftTodos.map((draft) => (
              <DraftTodoItem
                key={String(draft._id)}
                todo={draft}
                todoActions={todoActions}
                draftTodoActions={draftTodoActions}
              />
            ))}
          </li>
        </div>
      )}
      <MoreInfo />
    </div>
  );
}
