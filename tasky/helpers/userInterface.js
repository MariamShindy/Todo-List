import chalk from 'chalk' //Used for adding color styles to terminal output.
import figlet from 'figlet' //Used for rendering large ASCII art-style text in the terminal.
import Table from 'cli-table3' //Used for rendering nicely formatted tables in the terminal.
import dayjs from 'dayjs' //Used for formatting and manipulating dates.

export const printHeader = () => {
  const headerText = figlet.textSync("Tasky - Mariam Shindy")
  const line = chalk.redBright("=".repeat(headerText.split('\n')[0].length))
  console.log(line)
  console.log(chalk.red(headerText))
  console.log(line)
}

export const renderTasks = (tasks) => {
  const table = new Table({
    head: ['Task_Id','Title', 'Due_Date', 'Priority', 'Completed'],
    colWidths: [40,20, 15, 15, 12] //width (in characters) for each column in the table.
  })
  tasks.forEach(t => {
    table.push([
      t.id,
      t.title,
      dayjs(t.dueDate).format('YYYY-MM-DD'),
      t.priority,
      t.completed ? chalk.green("Yes") : chalk.red("No")
    ])
  })
  console.log(table.toString())
}
