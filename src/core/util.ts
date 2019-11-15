import chalk = require('chalk')
import ora = require('ora')
import fs from 'fs'
import { promisify } from 'util'
import rimraf from 'rimraf'

import { ProjectName } from '../types'

import { terminate } from './control'
import { getExpoCLIVersion, getReactNativeCLIVersion } from './process'
import { confirmOverwriteDirectory } from './prompts'

export function exists(handle: string): Promise<boolean> {
  return promisify(fs.exists)(handle)
}

export function rename(src: string, dest: string): Promise<void> {
  return promisify(fs.rename)(src, dest)
}

export function remove(file: string): Promise<void> {
  return promisify(fs.unlink)(file)
}

function removeDirectory(directory: string): Promise<void> {
  return promisify(rimraf)(directory)
}

export function readFile(fileName: string): Promise<string> {
  return promisify(fs.readFile)(fileName, 'utf8')
}

export function writeFile(fileName: string, contents: string): Promise<void> {
  return promisify(fs.writeFile)(fileName, contents, 'utf8')
}

async function checkForInstalledExpoCLI(): Promise<void> {
  const spinner = ora(chalk.cyan('Checking if Expo CLI is installed...'))

  try {
    spinner.start()
    const expoVersion = await getExpoCLIVersion()
    spinner.succeed(chalk.green(`Found Expo CLI ${expoVersion}`))
  } catch (error) {
    spinner.fail(
      'Expo CLI was not found. Please install expo-cli and re-run Vue Native CLI',
    )
    terminate()
  }
}

async function checkForInstalledReactNativeCLI(): Promise<void> {
  const spinner = ora(
    chalk.cyan('Checking if React Native CLI is installed...'),
  )

  try {
    spinner.start()
    const reactNativeCLIVersion = await getReactNativeCLIVersion()
    spinner.succeed(
      chalk.green(`Found React Native CLI ${reactNativeCLIVersion}`),
    )
  } catch (error) {
    spinner.fail(
      'React Native CLI was not found. Please install react-native-cli and re-run Vue Native CLI',
    )
    terminate()
  }
}

export async function ensureCLIDependencyIsInstalled(
  useExpo: boolean,
): Promise<void> {
  if (useExpo) {
    return checkForInstalledExpoCLI()
  } else {
    return checkForInstalledReactNativeCLI()
  }
}

export async function handlePreExistingDirectory(
  projectName: ProjectName,
): Promise<void> {
  const handleAlreadyExists = await exists(projectName)

  if (!handleAlreadyExists) {
    return
  }

  const overWriteDirectory = await confirmOverwriteDirectory(projectName)

  if (!overWriteDirectory) {
    terminate('The old file/directory was not removed. Exiting...', 'info')
  }

  const spinner = ora(
    chalk.yellow(`Removing file/directory with name ${projectName}`),
  ).start()

  await removeDirectory(projectName)

  spinner.succeed(
    chalk.green(`Pre-existing file/directory '${projectName}' removed`),
  )
}
