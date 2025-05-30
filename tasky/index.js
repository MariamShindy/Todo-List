import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import { taskSchema } from './helpers/validation.js'
import { printHeader, renderTasks } from './helpers/userInterface.js'
import {
  addTask,
  listTasks,
  updateTask,
  removeTask,
  markComplete,
  clearCompleted
} from './services/taskService.js'

const main = async () => {
  printHeader()

  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Tasky ==> What would you like to do?',
    choices: [
      'Add Task', 'List Tasks', 'Update Task',
      'Mark as Completed', 'Remove Task', 'Clear Completed Tasks', 'Exit'
    ]
  })

  switch (action) {
    case 'Add Task':
      const input = await inquirer.prompt([
        { name: 'title', message: 'Title:' },
        { name: 'description', message: 'Description:' },
        { name: 'dueDate', message: 'Due Date (YYYY-MM-DD):' },
        { name: 'priority', message: 'Priority (1-High, 2-Medium, 3-Low):' }
      ])
      try {
        const valid = taskSchema.parse(input)
        const spinner = ora('Adding task...').start()
        await addTask(valid)
        spinner.succeed('Task added!')
      } catch (e) {
        console.log(chalk.red(e.errors[0].message))
      }
      break

    case 'List Tasks':
      const { sortBy } = await inquirer.prompt({
        type: 'list',
        name: 'sortBy',
        message: 'Sort by:',
        choices: ['dueDate', 'priority', 'status']
      })
      const tasks = listTasks(sortBy)
      renderTasks(tasks)
      break

    case 'Update Task': {
      const { idToUpdate } = await inquirer.prompt({ name: 'idToUpdate', message: 'Task ID to update:' })
      const tasks = listTasks()
      const taskToUpdate = tasks.find(t => t.id === idToUpdate)
      if (!taskToUpdate) {
        console.log(chalk.red('No task found with this ID.'))
        break
      }
      const updateFields = await inquirer.prompt([
        { name: 'title', message: 'New Title (optional):' },
        { name: 'description', message: 'New Description (optional):' },
        { name: 'dueDate', message: 'New Due Date (optional):' },
        { name: 'priority', message: 'New Priority (1/2/3):' }
      ])
      for (const key in updateFields) {
        if (!updateFields[key]) {
          delete updateFields[key]
        }
      }
      await updateTask(idToUpdate, updateFields)
      console.log(chalk.green('Task updated.'))
      break
    }

    case 'Mark as Completed': {
      const { completeId } = await inquirer.prompt({ name: 'completeId', message: 'Task ID to mark complete:' })
      const tasks = listTasks()
      const taskToComplete = tasks.find(t => t.id === completeId)
      if (!taskToComplete) {
        console.log(chalk.red('No task found with this ID.'))
        break
      }
      await markComplete(completeId)
      console.log(chalk.green('Marked as completed.'))
      break
    }

    case 'Remove Task': {
      const { removeId } = await inquirer.prompt({ name: 'removeId', message: 'Task ID to remove:' })
      const tasks = listTasks()
      const taskToRemove = tasks.find(t => t.id === removeId)
      if (!taskToRemove) {
        console.log(chalk.red('No task found with this ID.'))
        break
      }
      await removeTask(removeId)
      console.log(chalk.green('Task removed.'))
      break
    }

    case 'Clear Completed Tasks': {
      const tasks = listTasks() 
      const completedTasks = tasks.filter(t => t.completed === true)
      if (completedTasks.length === 0) {
        console.log(chalk.red('There is no completed tasks to clear.'))
        break
      }
      await clearCompleted()
      console.log(chalk.green('Completed tasks cleared.'))
      break
    }


    case 'Exit':
      console.log(chalk.cyan('Tasky closed now!!'))
      return
  }

  main()
}

main()