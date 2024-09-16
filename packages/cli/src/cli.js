import { Command } from 'commander'
import prompts from 'prompts'
import { z } from 'zod'
import { tryThis } from '@ivnatsr/trythis'
import { cl } from '@ivnatsr/color-logs'
import yocto from 'yocto-spinner'
import figlet from 'figlet'
import { getUtility, getAllUtilities } from './requests.js'
import { writeUtility, createDirectoryIfNeeded } from './file-system.js'
import {
  formatComponentNameForDisplay,
  formatHookNameForDisplay,
  isComponentUtility,
  isHookUtility
} from './helpers.js'

const addOptionsSchema = z.object({
  utilities: z.array(z.string()).optional(),
  hooksPath: z.string().optional(),
  componentsPath: z.string().optional(),
  typescript: z.boolean().optional()
})

const add = new Command()
  .name('add')
  .description("Add EzReact's components and hooks utilities to your React projects.")
  .argument('[utilities...]', 'The utilities to add to your project.')
  .option('-hp, --hooks-path <path>', 'Path where hooks utilities should be added.')
  .option(
    '-cp, --components-path <path>',
    'Path where components utilities should be added.'
  )
  .option('-ts, --typescript', 'Add using TypeScript.')
  .action(async (utilities, options) => {
    const parsedOptions = addOptionsSchema.parse({
      utilities,
      ...options
    })

    let ext = parsedOptions.typescript ? 'ts' : null

    if (!ext) {
      const { value } = await prompts({
        type: 'select',
        name: 'value',
        message: 'Do you want to use TypeScript or JavaScript?',
        hint: 'Press <space> or <enter> to confirm your selection.',
        choices: [
          {
            title: 'TypeScript',
            value: 'ts'
          },
          {
            title: 'JavaScript',
            value: 'js'
          }
        ]
      })

      if (!value) {
        console.info(cl.brightYellow('No extension selected. Exiting CLI...'))
        process.exit(0)
      }

      ext = value
    }

    let utilitiesToAdd = parsedOptions.utilities
    const spinner = yocto({ color: 'cyan' })

    if (utilitiesToAdd.length === 0) {
      spinner.start('Retrieving utilities...')

      const [result, error] = await tryThis(
        Promise.all([
          getAllUtilities({ ext, type: 'hooks' })
          // getAllUtilities({ ext, type: 'components' })
        ])
      )

      if (error) {
        spinner.error(cl.red(error.message))
        process.exit(1)
      }

      spinner.success(cl.green('Utilities retrieved!'))
      const [allHooks, allComponents] = result

      const { values } = await prompts({
        type: 'multiselect',
        name: 'values',
        message: 'Which utilities do you want to add?',
        hint: '<space> to select/deselect one | <a> to select/deselect all | <enter> to confirm your selection.',
        instructions: false,
        choices: [
          ...allHooks.map((h) => ({
            title: formatHookNameForDisplay(h.name),
            value: h.name
          }))
          // TODO: Uncomment when components are added
          /* ...allComponents.map((c) => ({
            title: formatComponentNameForDisplay(c.name),
            value: c.name
          })) */
        ]
      })

      if (!values || values.length === 0) {
        console.info(cl.brightYellow('No utilities selected. Exiting CLI...'))
        process.exit(0)
      }

      // TODO: Uncomment when components are added
      /* utilitiesToAdd = [...allHooks, ...allComponents].filter((u) =>
        values.includes(u.name)
      ) */
      utilitiesToAdd = allHooks.filter((u) => values.includes(u.name))
    } else {
      spinner.start('Retrieving utilities...')

      const [result, error] = await tryThis(
        Promise.all(
          utilitiesToAdd.map((u) => {
            return getUtility({
              // A user should not be required to provide the extension
              // when adding utilities by providing their names,
              // that's why we cannot rely on checking for
              // a ".tsx" extension. Hence, we check if it's a hook instead
              name: `${u}.${ext}${isHookUtility(u) ? '' : 'x'}`,
              type: isHookUtility(u) ? 'hooks' : 'components'
            })
          })
        )
      )

      if (error) {
        spinner.error(cl.red(error.message))
        process.exit(1)
      }

      spinner.success(cl.green('Utilities retrieved!'))
      utilitiesToAdd = result
    }

    let hasHooks = false
    let hasComponents = false

    for (const { name } of utilitiesToAdd) {
      if (isComponentUtility(name)) hasComponents = true
      if (isHookUtility(name)) hasHooks = true
      if (hasHooks && hasComponents) break
    }

    let hooksPath = parsedOptions.hooksPath
    let componentsPath = parsedOptions.componentsPath

    if (!hooksPath && hasHooks) {
      const { value } = await prompts({
        type: 'text',
        name: 'value',
        message: 'Enter the path where hooks utilities should be added.',
        initial: 'src/hooks',
        hint: 'Press <enter> to confirm.',
        instructions: false
      })

      hooksPath = value
    }

    if (!componentsPath && hasComponents) {
      const { value } = await prompts({
        type: 'text',
        name: 'value',
        message: 'Enter the path where components utilities should be added.',
        initial: 'src/components',
        hint: 'Press <enter> to confirm.',
        instructions: false
      })

      componentsPath = value
    }

    if (hooksPath) createDirectoryIfNeeded(hooksPath)
    if (componentsPath) createDirectoryIfNeeded(componentsPath)

    spinner.start('Writing utilities...')

    const [, error] = await tryThis(
      Promise.all(
        utilitiesToAdd.map((u) => {
          return writeUtility({
            ...u,
            writePath: isComponentUtility(u.name) ? componentsPath : hooksPath
          })
        })
      )
    )

    if (error) {
      spinner.error(cl.red(error.message))
      process.exit(1)
    }

    spinner.success(
      cl.green('Done, all utilities added! Thanks for using EzReact. Happy coding!')
    )
  })

export function main() {
  console.log(
    figlet.textSync('EzReact CLI', {
      font: 'Star Wars',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 150,
      whitespaceBreak: true
    })
  )

  const program = new Command()
  program.name('@ivnatsr/ezreact')
  program.version('0.1.8', '-v, --version', 'Display current CLI version number')
  program.addCommand(add)
  program.parse()
}
