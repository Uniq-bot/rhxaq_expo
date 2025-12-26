import React, { useState } from 'react';

const TaskManager = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'alice', email: 'alice@example.com', active: true },
    { id: 2, username: 'bob', email: 'bob@example.com', active: true },
    { id: 3, username: 'charlie', email: 'charlie@example.com', active: false }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup database', status: 'done', userId: 1 },
    { id: 2, title: 'Build backend', status: 'in_progress', userId: 2 },
    { id: 3, title: 'Create UI', status: 'todo', userId: null }
  ]);

  const [message, setMessage] = useState('');

  // Valid state transitions
  const transitions = {
    todo: ['in_progress'],
    in_progress: ['review', 'todo'],
    review: ['done', 'in_progress'],
    done: []
  };

  const showMsg = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(''), 2500);
  };

  const addUser = () => {
    const username = prompt('Username:');
    const email = prompt('Email:');
    
    if (!username || !email) return;
    
    if (users.some(u => u.email === email)) {
      showMsg('Email already exists', true);
      return;
    }

    setUsers([...users, { 
      id: users.length + 1, 
      username, 
      email, 
      active: true 
    }]);
    showMsg('User created');
  };

  const addTask = () => {
    const title = prompt('Task title:');
    const userId = prompt('Assign to user ID (or leave empty):');
    
    if (!title) return;

    const assignTo = userId ? parseInt(userId) : null;

    // BUSINESS RULE: Check if user is active
    if (assignTo) {
      const user = users.find(u => u.id === assignTo);
      if (!user) {
        showMsg('User not found', true);
        return;
      }
      if (!user.active) {
        showMsg('Cannot assign to inactive user', true);
        return;
      }
    }

    setTasks([...tasks, {
      id: tasks.length + 1,
      title,
      status: 'todo',
      userId: assignTo
    }]);
    showMsg('Task created');
  };

  const changeStatus = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    
    // BUSINESS RULE: Validate transition
    if (!transitions[task.status].includes(newStatus)) {
      showMsg(`Cannot go from ${task.status} to ${newStatus}`, true);
      return;
    }

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
    showMsg('Status updated');
  };

  const toggleUser = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, active: !u.active } : u
    ));
  };

  const getUsername = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unassigned';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
      <p className="text-gray-600 mb-6">Simple sprint system</p>

      {/* Message */}
      {message && (
        <div className={`p-3 mb-4 rounded ${
          message.isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={addUser}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add User
        </button>
        <button 
          onClick={addTask}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Task
        </button>
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Users</h2>
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-white border rounded">
              <div>
                <span className="font-medium">{user.username}</span>
                <span className="text-sm text-gray-600 ml-2">({user.email})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded ${
                  user.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                }`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
                <button 
                  onClick={() => toggleUser(user.id)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Toggle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks by Status */}
      <div>
        <h2 className="text-xl font-bold mb-3">Tasks</h2>
        <div className="grid grid-cols-4 gap-4">
          {['todo', 'in_progress', 'review', 'done'].map(status => (
            <div key={status} className="bg-gray-50 p-3 rounded border">
              <h3 className="font-semibold mb-3 capitalize">
                {status.replace('_', ' ')}
              </h3>
              <div className="space-y-2">
                {tasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className="bg-white p-2 rounded border text-sm">
                    <div className="font-medium mb-1">{task.title}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      {getUsername(task.userId)}
                    </div>
                    {transitions[status].length > 0 && (
                      <div className="flex gap-1">
                        {transitions[status].map(next => (
                          <button
                            key={next}
                            onClick={() => changeStatus(task.id, next)}
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            → {next.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rules Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">Business Rules:</h3>
        <ul className="text-sm space-y-1">
          <li>✓ Tasks only assigned to active users</li>
          <li>✓ Status follows: todo → in_progress → review → done</li>
          <li>✓ Unique emails required</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskManager;