import chalk = require('chalk')
import _ from 'lodash'
import path from 'path'

import { GeneratorOptions, PackageManagerName } from '../types'

import { initWithExpo, initWithRNCLI, installPackages } from '../core/commands'
import {
  appJsonPath,
  appVueFileName,
  metroConfigFileName,
  vueFileExtensions,
  vueNativeDependencies,
  vueNativeDevDependencies,
  vueTransformerFileName,
} from '../core/constants'
import { executeInDirectory } from '../core/control'
import { spawnAsync } from '../core/process'
import { readFile, remove, writeFile } from '../core/util'

async function getSourceFileExtensions(): Promise<string[]> {
  const { getDefaultConfig } = await import(
    // eslint-disable-next-line comma-dangle
    `${process.cwd()}/node_modules/metro-config/src/index.js`
  )

  const {
    resolver: { sourceExts: defaultSourceExts },
  } = await getDefaultConfig()

  const sourceExts = _.union(defaultSourceExts, vueFileExtensions)
  // `sourceExts` now looks like ['js', 'json', 'ts', 'tsx', 'vue']

  return sourceExts
}

async function installVueNativeDependencies(
  packageManager: PackageManagerName,
): Promise<void> {
  console.log(chalk.cyan('Installing Vue Native dependencies...'))
  const [command, args] = installPackages(packageManager, vueNativeDependencies)
  await spawnAsync(command, args)
  console.log(chalk.green('Vue Native dependencies installed!'))
}

async function installVueNativeDevDependencies(
  packageManager: PackageManagerName,
): Promise<void> {
  console.log(chalk.cyan('Installing Vue Native dev-dependencies...'))
  const [command, args] = installPackages(
    packageManager,
    vueNativeDevDependencies,
  )
  await spawnAsync(command, args)
  console.log(chalk.green('Vue Native dev-dependencies installed!'))
}

export async function createVueNativeApp(
  projectName: string,
  { useExpo = true, packageManager = 'npm' }: GeneratorOptions,
): Promise<void> {
  console.log(
    chalk.green(`Creating Vue Native project ${chalk.bold(projectName)}\n`),
  )

  if (useExpo) {
    const [command, args] = initWithExpo(projectName)
    await spawnAsync(command, args)
  } else {
    const [command, args] = initWithRNCLI(projectName)
    await spawnAsync(command, args)
  }

  // Install Vue Native's dependencies and dev-dependencies
  // inside the project directory
  await executeInDirectory(projectName, async () => {
    await installVueNativeDependencies(packageManager)
    await installVueNativeDevDependencies(packageManager)
  })

  // Write the bundler config file

  const metroConfig = await readFile(
    path.resolve(__dirname, '../../template/metro.config.js'),
  )

  await writeFile(path.join(projectName, metroConfigFileName), metroConfig)

  // Write the transformer file

  const transformerContents = await readFile(
    path.resolve(__dirname, '../../template/vueTransformerPlugin.js'),
  )

  await writeFile(
    path.join(projectName, vueTransformerFileName),
    transformerContents,
  )

  // Do stuff in project directory and then move back to current directory
  await executeInDirectory(projectName, async () => {
    // Remove the App.js file
    await remove('App.js')

    // Delete the App.test.js file
    await remove('App.test.js')

    if (useExpo) {
      const fileContents = await readFile(path.join(appJsonPath))
      const expoObj = JSON.parse(fileContents)

      const sourceExts = await getSourceFileExtensions()

      // Modify the app.json file to add `sourceExts`
      // Adding `sourceExts` to metro.config.js stopped working for certain
      // versions of Expo
      // This fixes #23
      expoObj.expo.packagerOpts = {
        config: 'metro.config.js',
        sourceExts,
      }

      await writeFile(path.join(appJsonPath), JSON.stringify(expoObj, null, 2))
    }
  })

  // Create the App.vue file

  const appVueFileContent = await readFile(
    path.resolve(__dirname, '../../template/App.vue'),
  )

  await writeFile(path.join(projectName, appVueFileName), appVueFileContent)

  console.log(chalk.green('Setup complete!'))
}
