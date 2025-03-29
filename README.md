# Autocommit

A tool that automatically commits changes to git at regular intervals. Designed primarily for students to maintain a clear version history of their work, which can help demonstrate the progression of their projects and provide evidence against allegations of AI use.

## Features

- Automatically commits changes at regular intervals (default: 2 minutes)
- Each file is committed individually with a simple commit message
- Configurable through command-line options or a configuration file
- Ignores common files and directories by default (node_modules, .git, etc.)
- Includes a comprehensive .gitignore file by default
- Works with all types of text files, not just Node.js projects
- Note: Binary files are not ideal for this type of version control as they can't be properly diff'ed or merged

## Installation

### Global Installation (Recommended)

To install the package globally, which allows you to use the `autocommit` command from any directory:

```bash
# Clone the repository
git clone https://github.com/yourusername/autocommit.git

# Navigate to the directory
cd autocommit

# Install dependencies
npm install

# Link the package globally
npm link
```

After linking, you can use the `autocommit` command from any directory.

### Local Installation

If you prefer to install the package locally in a specific project:

```bash
# Navigate to your project directory
cd your-project

# Install autocommit as a dev dependency
npm install --save-dev /path/to/autocommit
```

Then you can run it using:

```bash
npx autocommit
```

## Usage

### Basic Usage

To start autocommit with default settings (2-minute interval):

```bash
autocommit
```

### Command-line Options

```bash
# Set a custom commit interval (in seconds)
autocommit --interval 60  # Commit every 1 minute

# Use a custom config file
autocommit --config my-autocommit-config.json

# Create a default config file
autocommit --init
```

### Configuration File

You can create a `.autocommit` file in your project directory to customize the behavior. Run `autocommit --init` to create a default configuration file, or create one manually:

```json
{
  "interval": 120000,
  "ignore": [
    "node_modules/**",
    ".git/**",
    ".autocommit",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
  ]
}
```

The `interval` is specified in milliseconds (2 minutes = 120000ms).

## How It Works

1. Autocommit watches for file changes in your project directory
2. When a file is modified, it waits for the specified interval
3. If no further changes are made to the file during that interval, it commits the file with the message "Updated {filename}"
4. Each file is committed individually to maintain a clear history

## Pushing Changes to GitHub

Autocommit only creates local git commits and does not automatically push these changes to remote repositories like GitHub. To make your commits visible on GitHub, you need to manually push them:

```bash
# Push all commits to the default remote branch (usually 'origin main' or 'origin master')
git push

# Or specify the remote and branch
git push origin main
```

You can push changes whenever you want:

- After each work session
- At the end of the day
- When you reach a milestone
- Before sharing your work with others

Regular pushing ensures your remote repository stays up-to-date with your local changes and provides an additional backup of your work.

## Requirements

- Node.js 18 or higher
- Git must be installed and configured
- The directory must be a git repository

## License

ISC
