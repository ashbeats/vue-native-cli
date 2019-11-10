import _ from 'lodash'

import { regex } from './constants'

export function regexMatch(regex: RegExp, sentence: string): string | void {
  const matches = sentence.match(regex)
  const bestMatch = _.first(matches)
  return bestMatch
}

export function isProjectNameValidForExpo(projectName: string): boolean {
  return !_.isEmpty(projectName) && regex.validExpoDirName.test(projectName)
}

export function isProjectNameValidForRN(projectName: string): boolean {
  return !_.isEmpty(projectName) && regex.validRNDirName.test(projectName)
}

export function isProjectNameValid(
  projectName: string,
  isExpoProject: boolean,
): boolean {
  let response = false
  if (isExpoProject) {
    response = isProjectNameValidForExpo(projectName)
  } else {
    response = isProjectNameValidForRN(projectName)
  }
  return response
}
