# EzReact CLI

EzReact CLI is a command-line interface designed to simplify the process of adding hooks and components utilities to your React projects. With EzReact CLI, you can quickly scaffold and manage your React utilities with ease.

## Usage

```bash
npx @ivnatsr/ezreact [command]
```

## Commands 

### `add`

Add EzReact's components and hooks utilities to your React projects.

```bash
npx @ivnatsr/ezreact add [utilities...] [options]
```

#### Arguments 

- `[utilities...]`: The utilities to add to your project. You can specify multiple utilities separated by spaces.

#### Options

- `-hp, --hooks-path <path>`: Path where hooks utilities should be added.
- `-cp, --components-path <path>`: Path where components utilities should be added.
- `-ts, --typescript`: Add using TypeScript.

### Other Commands

- `-v, --version`: Display the current version number of EzReact CLI.
- `-h, --help`: Display help information for EzReact CLI.

## Examples 

To add a hook utility called use-clipboard and a component utility called my-component you can run:

```bash
npx @ivnatsr/ezreact add use-clipboard my-component -hp src/hooks -cp src/components
```

This command will add the specified utilities to the designated paths in your React project.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an [issue](https://github.com/ivanatias/ezreact/issues) or submit a pull request.

Please, make sure to read the [CONTRIBUTING.md](../../CONTRIBUTING.md) file.

## License 

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
