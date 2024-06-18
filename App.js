import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './shanture-logo.png'; // Ensure you have the logo in the src directory

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data);
  };

  const addTask = async () => {
    if (newTask.trim()) {
      await axios.post('http://localhost:5000/tasks', { description: newTask });
      setNewTask('');
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const toggleTaskCompletion = async (id, completed) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const downloadPDF = () => {
    window.open('http://localhost:5000/download');
  };

  return (
    <div className="App">
      <header>
        <img src={logo} alt="Shanture Logo" />
        <h1>To-Do List</h1>
      </header>
      <main>
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id, task.completed)}
              />
              <span>{task.description}</span>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={downloadPDF}>Download PDF</button>
      </main>
    </div>
  );
}

export default App;
