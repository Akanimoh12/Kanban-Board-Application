// App.js
import React, { useState } from 'react';

const App = () => {
  const [boards, setBoards] = useState([
    {
      id: 1,
      name: 'To Do',
      tasks: [
        { id: 1, title: 'Task 1', description: 'Description of task 1' },
        { id: 2, title: 'Task 2', description: 'Description of task 2' },
      ],
    },
    {
      id: 2,
      name: 'In Progress',
      tasks: [],
    },
    {
      id: 3,
      name: 'Completed',
      tasks: [],
    },
  ]);

  const addTask = (boardId, task) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId ? { ...board, tasks: [...board.tasks, task] } : board
      )
    );
  };

  const moveTask = (taskId, fromBoardId, toBoardId) => {
    const taskToMove = boards
      .find((board) => board.id === fromBoardId)
      .tasks.find((task) => task.id === taskId);

      setBoards(boards.map(board => {
        if(board.id === fromBoardId) {
          return {...board, tasks: board.tasks.filter(task => task.id !== taskId)}
        } else if (board.id === toBoardId) {
          return {...board, tasks: [...board.tasks, taskToMove]}
        } else {
          return board
        }
      }))
  };

  const [newTask, setNewTask] = useState({ title: '', description: '' });

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
      </header>

      <main className="container mx-auto p-4 flex flex-col md:flex-row space-x-4 mt-4">
        {boards.map((board) => (
          <div key={board.id} className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{board.name}</h2>
              <button className="text-gray-500 hover:text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 6v6m-6-3h12"
                  />
                </svg>
              </button>
            </div>
            {board.tasks.length === 0 ? (
              <p className="text-gray-400 text-center">No tasks yet</p>
            ) : (
              board.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-200 rounded-lg p-2 mb-2 shadow hover:bg-gray-300 cursor-grab"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('taskId', task.id);
                    e.dataTransfer.setData('fromBoardId', board.id);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const taskId = parseInt(e.dataTransfer.getData('taskId'));
                    const fromBoardId = parseInt(e.dataTransfer.getData('fromBoardId'));
                    const toBoardId = board.id;
                    if(fromBoardId !== toBoardId) {
                      moveTask(taskId, fromBoardId, toBoardId)
                    }
                  }}
                >
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              ))
            )}

            {/* Add Task Form */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Task Title"
                className="w-full border rounded p-2 mb-2"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full border rounded p-2 mb-2"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <button
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                onClick={() => {
                  addTask(board.id, {
                    id: Date.now(), // Simple ID generation
                    title: newTask.title,
                    description: newTask.description,
                  });
                  setNewTask({ title: '', description: '' });
                }}
              >
                Add Task
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2023 Kanban Board App</p>
      </footer>
    </div>
  );
};

export default App;