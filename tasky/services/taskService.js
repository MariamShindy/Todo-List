import db from '../helpers/db.js'
import { v4 as uuidv4 } from 'uuid' //To make the id GUID

//Add a new task
export const addTask = async (task) => {
  db.data.tasks.push({
    ...task,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    completed: false
  })
  await db.write()
}

//List all tasks
export const listTasks = (sortBy = 'dueDate') => {
  let tasks = db.data.tasks
  if (sortBy === 'priority') tasks = tasks.sort((a, b) => a.priority - b.priority)
  else if (sortBy === 'status') tasks = tasks.sort((a, b) => a.completed - b.completed)
  else tasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  return tasks
}

//Update a specific task
export const updateTask = async (id, updatedFields) => {
  const task = db.data.tasks.find(t => t.id === id)
  if (task) Object.assign(task, updatedFields)
  await db.write()
}

//Remove a task
export const removeTask = async (id) => {
  db.data.tasks = db.data.tasks.filter(t => t.id !== id)
  await db.write()
}

//Mark a task as completed 
export const markComplete = async (id) => {
  const task = db.data.tasks.find(t => t.id === id)
  if (task) task.completed = true
  await db.write()
}

//Remove completed tasks
export const clearCompleted = async () => {
  db.data.tasks = db.data.tasks.filter(t => !t.completed)
  await db.write()
}

