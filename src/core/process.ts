import { spawn } from 'cross-spawn'
import semverRegex from 'semver-regex'

import { Command, CommandArgs } from '../types'

import { expoVersion, reactNativeCLIVersion, yarnVersion } from './commands'
import { regexMatch } from './validation'

export function spawnAsync(command: Command, args: CommandArgs): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true, stdio: 'inherit' })

    child.on('error', () => {
      console.log()
      reject()
    })

    child.on('exit', () => {
      // A hack that seems to ensure the main process continues
      // after the child exits
      // TODO: look into why this happens
      console.log()
      resolve()
    })
  })
}

function findCLIVersionInMessage(cliMessage: string): string | void {
  return regexMatch(semverRegex(), cliMessage)
}

function getCLIVersion(cliCommand: [Command, CommandArgs]): Promise<string> {
  return new Promise((resolve, reject) => {
    const [command, args] = cliCommand
    const child = spawn(command, args)

    child.on('error', error => {
      reject(error)
    })

    child.stdout.on('data', cliMessage => {
      if (!cliMessage) {
        return
      }

      const cliVersion = findCLIVersionInMessage(cliMessage.toString())

      if (cliVersion) {
        resolve(cliVersion)
      } else {
        reject(cliMessage)
      }
    })
  })
}

export function getExpoCLIVersion(): Promise<string> {
  return getCLIVersion(expoVersion)
}

export function getReactNativeCLIVersion(): Promise<string> {
  return getCLIVersion(reactNativeCLIVersion)
}

export function getYarnVersion(): Promise<string> {
  return getCLIVersion(yarnVersion)
}
