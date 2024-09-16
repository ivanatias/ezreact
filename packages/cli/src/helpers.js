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
