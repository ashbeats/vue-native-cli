#!/usr/bin/env node

import program from 'commander'

import { ProjectName } from './types'

import { ensureProjectNameIsValid, getPackageManager } from './core/prompts'
import {
  ensureCLIDependencyIsInstalled,
  handlePreExistingDirectory,
} from './core/util'
import { createVueNativeApp } from './generator'

program
  .version('0.1.2', '-v, --version')
  .description('A CLI to create Vue Native apps')
  .usage('init <projectName>')

program
  .command('init <projectName>')
  .description('Create a Vue Native project')
  .option('--no-expo', 'Use react-native-cli instead of expo-cli')
  .action(async (projectName: ProjectName, cmd) => {
    const useExpo = cmd.expo

    await ensureCLIDependencyIsInstalled(useExpo)

    const packageManager = await getPackageManager()

    await ensureProjectNameIsValid(projectName, useExpo)

    await handlePreExistingDirectory(projectName)

    await createVueNativeApp(projectName, { useExpo, packageManager })
  })

program.arguments('*').action(({ args }) => {
  console.log(`Unkonwn argument ${args[0]}`)
  console.log()
  program.help()
})

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
