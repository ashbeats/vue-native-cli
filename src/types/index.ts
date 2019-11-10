export type PackageManagerName = 'npm' | 'yarn'

export type Command = string

export type CommandArgs = string[]

export type Continuation<T> = () => T

export type ProjectName = string

export interface GeneratorOptions {
  packageManager?: PackageManagerName
  useExpo?: boolean
}

export type Status = 'error' | 'warning' | 'info' | 'success'

export enum StatusColor {
  error = 'red',
  warning = 'yellow',
  info = 'cyan',
  success = 'green',
}
