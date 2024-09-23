---
title: CLI
---

EzReact's CLI is a command-line interface designed to simplify the process of adding hooks and components utilities to your React projects.

## Usage 

```bash
npx @ivnatsr/ezreact [command]
```  

## Add a utility

Add EzReact's components and hooks utilities to your React projects:

```bash
npx @ivnatsr/ezreact add [utilities...] [options]
```

### Arguments
- `[utilities...]`: The utilities to add to your project. You can specify multiple utilities separated by spaces. Passing the utilities is **optional**. If you don't specify any utility, the CLI will provide you with all the available utilities for you to choose from.
Options
- `-hp, --hooks-path <path>`: Path where hooks utilities should be added. **(Optional)**
- `-cp, --components-path <path>`: Path where components utilities should be added. **(Optional)**
- `-ts, --typescript`: Add using TypeScript. **(Optional)**

## Examples

### Adding an utility

To add a hook utility called `use-clipboard` you can run:

```bash
npx @ivnatsr/ezreact add use-clipboard
```

In this example, since you are not specifying any option, the CLI will prompt you to provide all of them. For example, if you want to use TypeScript or JavaScript, the path where the hook utility should be added, and so on.