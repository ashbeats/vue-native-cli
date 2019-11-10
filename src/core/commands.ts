import { Command, CommandArgs, PackageManagerName, ProjectName } from '../types'

import {
  PackageManagers,
  expoPackageName,
  rnPackageName,
  rnVersion,
} from './constants'

export const expoVersion: [Command, CommandArgs] = [
  expoPackageName,
  ['--version'],
]

export const reactNativeCLIVersion: [Command, CommandArgs] = [
  rnPackageName,
  ['--version'],
]

export const yarnVersion: [Command, CommandArgs] = [
  PackageManagers.yarn,
  ['--version'],
]

export const installPackages = (
  packageManager: PackageManagerName,
  packages: string[],
  dev = false,
): [Command, CommandArgs] => {
  const installCommand =
    packageManager === PackageManagers.yarn ? 'add' : 'install'

  const options = [installCommand, ...packages]

  if (packageManager === PackageManagers.yarn) {
    if (dev) {
      options.push('--dev')
    }
  }

  if (packageManager === PackageManagers.yarn) {
    if (dev) {
      options.push('--save-dev')
    } else {
      options.push('--save')
    }
  }

  return [packageManager, options]
}

export const initWithExpo = (
  projectName: ProjectName,
): [Command, CommandArgs] => [
  expoPackageName,
  ['init', '--template=blank', projectName],
]

export const initWithRNCLI = (
  projectName: ProjectName,
): [Command, CommandArgs] => [
  rnPackageName,
  ['init', projectName, '--version', rnVersion],
]
