import chalk = require('chalk')

import { Status, StatusColor } from '../types'

import { defaultTerminationMessage } from './messages'

export function terminate(
  message = defaultTerminationMessage,
  status: Status = 'info',
): void {
  const type = StatusColor[status]

  console.log(chalk[type](message))

  process.exit(0)
}

export async function executeInDirectory(
  directory: string,
  fn: () => any,
): Promise<void> {
  const prevLocation = process.cwd()
  process.chdir(directory)

  await fn()

  process.chdir(prevLocation)
}
