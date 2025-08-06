#!/usr/bin/env node

import { exec, spawn } from "child_process";

import { fileURLToPath } from "url";
import path from "path";
import process from "process";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

class AutoDeployServer {
  constructor() {
    this.serverProcess = null;
    this.isDeploying = false;
    this.checkInterval = 60000; // 1 minute
    this.currentCommitHash = null;

    // Handle graceful shutdown
    process.on("SIGINT", () => this.shutdown());
    process.on("SIGTERM", () => this.shutdown());
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  async getCurrentCommitHash() {
    try {
      const { stdout } = await execAsync("git rev-parse origin/main", {
        cwd: process.cwd(),
      });
      return stdout.trim();
    } catch (error) {
      this.log(`Error getting current commit hash: ${error.message}`);
      return null;
    }
  }

  async checkForUpdates() {
    try {
      // Fetch latest changes from origin
      await execAsync("git fetch origin main", { cwd: process.cwd() });

      const latestCommitHash = await this.getCurrentCommitHash();
      this.log(latestCommitHash);

      if (!latestCommitHash) {
        this.log("Failed to get latest commit hash");
        return false;
      }

      if (this.currentCommitHash === null) {
        this.currentCommitHash = latestCommitHash;
        this.log(
          `Initial commit hash set to: ${latestCommitHash.substring(0, 8)}`
        );
        return false;
      }

      if (this.currentCommitHash !== latestCommitHash) {
        this.log(
          `New updates detected! ${this.currentCommitHash.substring(
            0,
            8
          )} -> ${latestCommitHash.substring(0, 8)}`
        );
        this.currentCommitHash = latestCommitHash;
        return true;
      }

      return false;
    } catch (error) {
      this.log(`Error checking for updates: ${error.message}`);
      return false;
    }
  }

  async stopServer() {
    if (this.serverProcess) {
      this.log("Stopping server...");

      return new Promise((resolve) => {
        this.serverProcess.kill("SIGTERM");

        const timeout = setTimeout(() => {
          this.log("Server did not stop gracefully, forcing kill...");
          this.serverProcess.kill("SIGKILL");
          resolve();
        }, 10000); // 10 second timeout

        this.serverProcess.on("exit", () => {
          clearTimeout(timeout);
          this.log("Server stopped");
          this.serverProcess = null;
          resolve();
        });
      });
    }
  }

  async pullChanges() {
    this.log("Pulling changes from origin/main...");
    try {
      const { stdout, stderr } = await execAsync("git pull origin main", {
        cwd: process.cwd(),
      });
      this.log("Git pull completed");
      if (stdout) this.log(`Git output: ${stdout}`);
      if (stderr) this.log(`Git stderr: ${stderr}`);
    } catch (error) {
      this.log(`Error pulling changes: ${error.message}`);
      throw error;
    }
  }

  async installDependencies() {
    this.log("Installing dependencies...");
    try {
      const { stdout, stderr } = await execAsync("npm install", {
        cwd: __dirname,
      });
      this.log("Dependencies installed");
      if (stdout) this.log(`npm install output: ${stdout}`);
      if (stderr) this.log(`npm install stderr: ${stderr}`);
    } catch (error) {
      this.log(`Error installing dependencies: ${error.message}`);
      throw error;
    }
  }

  async buildProject() {
    this.log("Building project...");
    try {
      const { stdout, stderr } = await execAsync("npm run build", {
        cwd: __dirname,
      });
      this.log("Build completed");
      if (stdout) this.log(`Build output: ${stdout}`);
      if (stderr) this.log(`Build stderr: ${stderr}`);
    } catch (error) {
      this.log(`Error building project: ${error.message}`);
      throw error;
    }
  }

  async startServer() {
    this.log("Starting server...");
    this.log(__dirname);
    this.serverProcess = spawn("node", ["dist/server.js"], {
      cwd: __dirname,
      stdio: ["pipe", "pipe", "pipe"],
      detached: false,
    });

    this.serverProcess.stdout.on("data", (data) => {
      this.log(`Server: ${data.toString().trim()}`);
    });

    this.serverProcess.stderr.on("data", (data) => {
      this.log(`Server Error: ${data.toString().trim()}`);
    });

    this.serverProcess.on("exit", (code) => {
      this.log(`Server process exited with code ${code}`);
      this.serverProcess = null;
    });

    this.serverProcess.on("error", (error) => {
      this.log(`Server process error: ${error.message}`);
      this.serverProcess = null;
    });

    // Give the server a moment to start
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.log("Server started");
  }

  async deployUpdates() {
    if (this.isDeploying) {
      this.log("Deployment already in progress, skipping...");
      return;
    }

    this.isDeploying = true;

    try {
      this.log("Starting deployment process...");

      // Stop current server
      await this.stopServer();

      // Pull latest changes
      await this.pullChanges();

      // Install dependencies
      await this.installDependencies();

      // Build project
      await this.buildProject();

      // Start server
      await this.startServer();

      this.log("Deployment completed successfully!");
    } catch (error) {
      this.log(`Deployment failed: ${error.message}`);

      // Try to restart the server even if deployment failed
      if (!this.serverProcess) {
        this.log("Attempting to restart server after failed deployment...");
        try {
          await this.startServer();
        } catch (startError) {
          this.log(`Failed to restart server: ${startError.message}`);
        }
      }
    } finally {
      this.isDeploying = false;
    }
  }

  async run() {
    this.log("Auto-deploy server starting...");
    this.log(`Monitoring interval: ${this.checkInterval / 1000} seconds`);

    try {
      // Initial setup
      await this.buildProject();
      await this.startServer();

      // Set initial commit hash
      this.currentCommitHash = await this.getCurrentCommitHash();

      // Start monitoring loop
      const checkForUpdatesAndDeploy = async () => {
        try {
          const hasUpdates = await this.checkForUpdates();
          if (hasUpdates) {
            await this.deployUpdates();
          }
        } catch (error) {
          this.log(`Error in monitoring loop: ${error.message}`);
        }
      };

      // Initial check
      this.log("Starting monitoring for Git updates...");
      setInterval(checkForUpdatesAndDeploy, this.checkInterval);
    } catch (error) {
      this.log(`Failed to start auto-deploy server: ${error.message}`);
      process.exit(1);
    }
  }

  async shutdown() {
    this.log("Shutting down auto-deploy server...");

    if (this.serverProcess) {
      await this.stopServer();
    }

    this.log("Auto-deploy server stopped");
    process.exit(0);
  }
}

// Start the auto-deploy server
const autoDeployServer = new AutoDeployServer();
autoDeployServer.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
