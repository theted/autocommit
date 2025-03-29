#!/usr/bin/env node

import { watch } from "chokidar";
import { simpleGit } from "simple-git";
import { program } from "commander";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join, relative } from "path";

// Default configuration
const DEFAULT_CONFIG = {
  interval: 120000, // 2 minutes in milliseconds
  ignore: [
    "node_modules/**",
    ".git/**",
    ".autocommit",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
  ],
};

// Track modified files and their last commit time
const fileStatus = new Map();

// Get the current directory
const currentDir = process.cwd();

// Initialize git
const git = simpleGit(currentDir);

// Parse command line arguments
program
  .name("autocommit")
  .description("Automatically commits changes at regular intervals")
  .option("-i, --interval <seconds>", "commit interval in seconds", parseInt)
  .option("-c, --config <path>", "path to config file", ".autocommit")
  .option("--init", "create a default config file")
  .version("1.0.0")
  .parse(process.argv);

const options = program.opts();

// Create a default config file if --init is specified
const createDefaultConfig = async () => {
  const configPath = join(currentDir, options.config || ".autocommit");

  if (existsSync(configPath)) {
    console.log(`Config file already exists at ${configPath}`);
    return;
  }

  try {
    await writeFile(
      configPath,
      JSON.stringify(DEFAULT_CONFIG, null, 2),
      "utf8"
    );
    console.log(`Created default config file at ${configPath}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error creating config file: ${error.message}`);
    process.exit(1);
  }
};

if (options.init) {
  createDefaultConfig();
}

// Load configuration
const loadConfig = async () => {
  const configPath = join(currentDir, options.config || ".autocommit");
  let config = { ...DEFAULT_CONFIG };

  // Override with file config if it exists
  if (existsSync(configPath)) {
    try {
      const fileContent = await readFile(configPath, "utf8");
      const fileConfig = JSON.parse(fileContent);
      config = { ...config, ...fileConfig };
    } catch (error) {
      console.error(`Error reading config file: ${error.message}`);
    }
  }

  // Override with command line options
  if (options.interval) {
    config.interval = options.interval * 1000; // Convert seconds to milliseconds
  }

  return config;
};

// Check if the current directory is a git repository
const checkGitRepo = async () => {
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.error("Current directory is not a git repository");
      process.exit(1);
    }
  } catch (error) {
    console.error(`Git error: ${error.message}`);
    process.exit(1);
  }
};

// Commit a single file
const commitFile = async (filePath) => {
  try {
    const relativePath = relative(currentDir, filePath);

    // Check if file is staged
    const status = await git.status();
    const isTracked = status.files.some(
      (file) =>
        file.path === relativePath &&
        (file.working_dir !== " " || file.index !== " ")
    );

    // Add the file
    await git.add(relativePath);

    // Commit the file
    await git.commit(`Updated ${relativePath}`);

    console.log(`Committed: ${relativePath}`);

    // Update the last commit time
    fileStatus.set(filePath, Date.now());
  } catch (error) {
    console.error(`Error committing ${filePath}: ${error.message}`);
  }
};

// Process pending commits
const processCommits = async (config) => {
  const now = Date.now();

  for (const [filePath, lastModified] of fileStatus.entries()) {
    // Check if enough time has passed since the last modification
    if (now - lastModified >= config.interval) {
      await commitFile(filePath);
    }
  }
};

// Start the watcher
const startWatcher = async () => {
  const config = await loadConfig();

  console.log(
    `Starting autocommit with ${config.interval / 1000} seconds interval`
  );

  // Set up the watcher
  const watcher = watch(".", {
    ignored: config.ignore,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  // Handle file changes
  watcher.on("change", (filePath) => {
    console.log(`File changed: ${filePath}`);
    fileStatus.set(filePath, Date.now());
  });

  // Handle errors
  watcher.on("error", (error) => {
    console.error(`Watcher error: ${error}`);
  });

  // Set up the commit interval
  setInterval(() => processCommits(config), 10000); // Check every 10 seconds

  console.log("Watching for file changes...");
};

// Main function
const main = async () => {
  await checkGitRepo();
  await startWatcher();
};

// Start the application
main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
