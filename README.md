# ⚠️ WARNING: THIS IS NOT INTENDED FOR PRODUCTION WORK! ⚠️

## ⚠️ Commit History Warning ⚠️

Using this tool may significantly clutter your git commit history for the following reasons:

1. **High commit volume**: Each file is committed individually, potentially creating hundreds of commits in a single work session.
2. **Generic commit messages**: All commits use the simple format "Updated {filename}" without meaningful context about what changed.
3. **No logical grouping**: Related changes across multiple files will be split into separate commits, making it difficult to understand the development progression.
4. **Difficult code review**: The granular nature of commits makes pull request reviews challenging as logical changes are fragmented.
5. **Complicates git operations**: Operations like bisect, revert, cherry-pick, and squashing become more difficult with a cluttered history.

**Recommended Use Cases:**

- Student projects where maintaining a detailed history is more important than a clean commit log
- Solo projects where you want automatic version control without manual commits
- Learning environments where tracking incremental changes is beneficial

**Not Recommended For:**

- Professional or production codebases
- Collaborative team projects
- Open source contributions
- Any repository where a clean, meaningful commit history is important

Consider using conventional git workflows with meaningful commits for professional work.

# Autocommit

A tool that automatically commits changes to git at regular intervals. Designed primarily for students to maintain a clear version history of their work, which can help demonstrate the progression of their projects and provide evidence against allegations of AI use.

**GitHub Repository:** [https://github.com/theted/autocommit](https://github.com/theted/autocommit)

## Features

- Automatically commits changes at regular intervals (default: 2 minutes)
- Each file is committed individually with a simple commit message
- Configurable through command-line options or a configuration file
- Ignores common files and directories by default (node_modules, .git, etc.)
- Includes a comprehensive .gitignore file by default
- Works with all types of text files, not just Node.js projects
- Note: Binary files are not ideal for this type of version control as they can't be properly diff'ed or merged

### Text-Based vs. Binary File Formats

**Binary file formats** like Microsoft Office documents (.docx, .xlsx, .pptx), PDFs, and image files (.jpg, .png) are not well-suited for version control systems like Git for several reasons:

1. **No meaningful diffs**: When you change a binary file, Git can only show that the file changed but cannot display what specific content changed. This makes code reviews and history tracking nearly impossible.

2. **Merge conflicts**: Binary files cannot be automatically merged when conflicts occur. If two people modify the same binary file, one person's changes will completely overwrite the other's.

3. **Repository bloat**: Each version of a binary file is stored in its entirety, causing repository size to grow rapidly with each change.

4. **Limited collaboration**: Without the ability to see specific changes or merge effectively, collaboration on binary files becomes challenging.

**Text-based alternatives** provide significant advantages for version control:

| Binary Format | Text-Based Alternative | Benefits                                                                   |
| ------------- | ---------------------- | -------------------------------------------------------------------------- |
| Word (.docx)  | Markdown (.md)         | Simple syntax, readable in any text editor, excellent for documentation    |
| Word (.docx)  | LaTeX (.tex)           | Superior typesetting for academic papers, equations, and complex documents |
| Excel (.xlsx) | CSV (.csv)             | Simple tabular data that can be diff'ed and edited in any text editor      |
| Excel (.xlsx) | JSON/YAML (.json/.yml) | Structured data with clear version control differences                     |
| PowerPoint    | Markdown + Reveal.js   | Presentations as code with version-controlled slides                       |
| Photoshop     | SVG (.svg)             | Vector graphics as XML text that can be diff'ed                            |

**Benefits of text-based formats for version control:**

1. **Clear diffs**: See exactly what changed between versions (added/removed text, modified values)
2. **Effective merging**: Automatically merge changes from multiple contributors
3. **Smaller repository size**: Store only the differences between versions, not entire files
4. **Better collaboration**: Review specific changes, resolve conflicts line-by-line
5. **Plain text editing**: Edit with any text editor without specialized software
6. **Automation friendly**: Parse and generate content programmatically

For projects using autocommit, consider converting binary documents to text-based alternatives whenever possible to take full advantage of Git's version control capabilities.

## Installation

### Global Installation (Recommended)

To install the package globally, which allows you to use the `autocommit` command from any directory:

```bash
# Clone the repository
git clone https://github.com/theted/autocommit.git

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
5. All commits are made to the currently checked out branch - the tool does not switch branches or create new ones

> **Note on Branch Handling**: Autocommit always commits to the currently active branch in your repository. Make sure you're on the correct branch before starting the tool. If you need to work on a different branch, stop autocommit, switch branches, and then restart the tool.

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
