import { readFileSync } from 'node:fs'

export function isComponentUtility(name) {
  return name.split('.').pop().endsWith('x')
}

export function isHookUtility(name) {
  return name.startsWith('use')
}

export function formatHookNameForDisplay(hook) {
  return hook
    .slice(0, -3)
    .split('-')
    .map((l, i) => (i > 0 ? l.slice(0, 1).toUpperCase() + l.slice(1) : l))
    .join('')
}

export function formatComponentNameForDisplay(component) {
  return component
    .slice(0, -4)
    .split('-')
    .map((l) => l.slice(0, 1).toUpperCase() + l.slice(1))
    .join('')
}

export function getPackageJsonInfo() {
  const packageJsonContent = readFileSync('package.json', 'utf-8')
  return JSON.parse(packageJsonContent)
}
