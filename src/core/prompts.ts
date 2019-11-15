import chalk = require('chalk')
import ora = require('ora')
import inquirer from 'inquirer'

import { PackageManagerName, ProjectName } from '../types'

import { PackageManagers } from './constants'
import { getYarnVersion } from './process'
import {
  isProjectNameValid,
  isProjectNameValidForExpo,
  isProjectNameValidForRN,
} from './validation'

export async function getPackageManager(): Promise<PackageManagerName> {
  const spinner = ora(chalk.cyan('Checking if Yarn is installed'))

  let yarnInstalled = false
  try {
    spinner.start()
    const yarnVersion = await getYarnVersion()
    spinner.succeed(chalk.green(`Found Yarn version ${yarnVersion}`))
    yarnInstalled = true
  } catch (error) {
    spinner.info(chalk.cyan('Yarn was not found. Proceeding with NPM...'))
    yarnInstalled = false
  }

  if (!yarnInstalled) {
    return PackageManagers.npm
  }

  const questions = [
    {
      name: 'packageManager',
      type: 'list',
      message: 'Which package manager would you like to use?',
      choices: [
        { name: 'Yarn', value: PackageManagers.yarn },
        { name: 'NPM', value: PackageManagers.npm },
      ],
    },
  ]

  const { packageManager } = await inquirer.prompt(questions)

  return packageManager
}

export async function confirmOverwriteDirectory(
  dirname: string,
): Promise<boolean> {
  const questions = [
    {
      name: 'overWriteExistingDirectory',
      type: 'confirm',
      message: `A directory with the name ${dirname} already exists. Overwrite?`,
    },
  ]

  const { overWriteExistingDirectory } = await inquirer.prompt(questions)

  return overWriteExistingDirectory
}

export async function promptReEnterProjectName(
  name: string,
  validate: (newName: string) => boolean,
): Promise<string> {
  const questions = [
    {
      name: 'reEnteredProjectName',
      type: 'input',
      message: `Project name ${name} is invalid. Please re-enter the project name`,
      validate,
    },
  ]

  const { reEnteredProjectName } = await inquirer.prompt(questions)

  return reEnteredProjectName
}

export async function ensureProjectNameIsValid(
  projectName: ProjectName,
  useExpo: boolean,
): Promise<void> {
  const isValid = isProjectNameValid(projectName, useExpo)

  const validator = useExpo
    ? isProjectNameValidForExpo
    : isProjectNameValidForRN

  if (!isValid) {
    await promptReEnterProjectName(projectName, validator)
  }
}
