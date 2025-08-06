#!/usr/bin/env node

/**
 * Melon Business App - GitHub Release Creator
 *
 * This script:
 * 1. Detects current version from package.json
 * 2. Prompts for version bump type (patch/minor/major)
 * 3. Updates package.json and app.json
 * 4. Creates git tag and pushes to GitHub
 * 5. Creates GitHub release with auto-generated changelog
 *
 * Usage: node scripts/createNewRelease.js
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

class ReleaseManager {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..')
    this.packageJsonPath = path.join(this.rootDir, 'package.json')
    this.appJsonPath = path.join(this.rootDir, 'app.json')
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
  }

  async question(query) {
    return new Promise((resolve) => {
      this.rl.question(query, resolve)
    })
  }

  // Execute shell command and return output
  exec(command, options = {}) {
    try {
      const result = execSync(command, {
        encoding: 'utf8',
        cwd: this.rootDir,
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      })
      // Handle null/undefined results and normalize line endings
      return result ? result.toString().replace(/\r\n/g, '\n').trim() : ''
    } catch (error) {
      this.log(`❌ Command failed: ${command}`, 'red')
      this.log(`Error: ${error.message}`, 'red')
      if (error.stdout) {
        this.log(`Stdout: ${error.stdout}`, 'yellow')
      }
      if (error.stderr) {
        this.log(`Stderr: ${error.stderr}`, 'yellow')
      }
      process.exit(1)
    }
  }

  // Read and parse JSON file
  readJsonFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      this.log(`❌ Failed to read ${filePath}: ${error.message}`, 'red')
      process.exit(1)
    }
  }

  // Write JSON file with proper formatting
  writeJsonFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
    } catch (error) {
      this.log(`❌ Failed to write ${filePath}: ${error.message}`, 'red')
      process.exit(1)
    }
  }

  // Get current version from package.json
  getCurrentVersion() {
    const packageJson = this.readJsonFile(this.packageJsonPath)
    return packageJson.version || '0.0.0'
  }

  // Increment version based on type
  incrementVersion(version, type) {
    const parts = version.split('.').map(Number)
    let [major, minor, patch] = parts

    switch (type) {
      case 'major':
        major += 1
        minor = 0
        patch = 0
        break
      case 'minor':
        minor += 1
        patch = 0
        break
      case 'patch':
        patch += 1
        break
      default:
        throw new Error(`Invalid version type: ${type}`)
    }

    return `${major}.${minor}.${patch}`
  }

  // Update version in package.json
  updatePackageJson(newVersion) {
    const packageJson = this.readJsonFile(this.packageJsonPath)
    packageJson.version = newVersion
    this.writeJsonFile(this.packageJsonPath, packageJson)
    this.log(`✅ Updated package.json to version ${newVersion}`, 'green')
  }

  // Update version in app.json (Expo)
  updateAppJson(newVersion) {
    if (!fs.existsSync(this.appJsonPath)) {
      this.log('⚠️  app.json not found, skipping...', 'yellow')
      return
    }

    const appJson = this.readJsonFile(this.appJsonPath)

    if (appJson.expo) {
      appJson.expo.version = newVersion

      // Auto-increment build numbers for app stores
      if (appJson.expo.ios?.buildNumber) {
        const currentBuild = parseInt(appJson.expo.ios.buildNumber) || 1
        appJson.expo.ios.buildNumber = (currentBuild + 1).toString()
      }

      if (appJson.expo.android?.versionCode) {
        const currentCode = parseInt(appJson.expo.android.versionCode) || 1
        appJson.expo.android.versionCode = currentCode + 1
      }
    }

    this.writeJsonFile(this.appJsonPath, appJson)
    this.log(`✅ Updated app.json to version ${newVersion}`, 'green')
  }

  // Check if git working directory is clean
  checkGitStatus() {
    try {
      const status = this.exec('git status --porcelain', { silent: true })
      if (status && status.length > 0) {
        this.log('❌ Git working directory is not clean. Please commit or stash changes first.', 'red')
        this.log('Uncommitted changes:', 'yellow')
        console.log(status)
        process.exit(1)
      }
    } catch (error) {
      this.log('❌ Not a git repository or git is not installed', 'red')
      process.exit(1)
    }
  }

  // Get the current git branch
  getCurrentBranch() {
    return this.exec('git rev-parse --abbrev-ref HEAD', { silent: true })
  }

  // Generate changelog since last tag
  generateChangelog(newVersion) {
    try {
      // Get the last tag
      let lastTag
      try {
        lastTag = this.exec('git describe --tags --abbrev=0', { silent: true })
      } catch (error) {
        lastTag = ''
      }

      let commitRange
      if (lastTag && lastTag.length > 0) {
        commitRange = `${lastTag}..HEAD`
        this.log(`📝 Generating changelog from ${lastTag} to HEAD`, 'cyan')
      } else {
        commitRange = 'HEAD'
        this.log('📝 Generating changelog from first commit', 'cyan')
      }

      // Get commit messages
      let commits
      try {
        commits = this.exec(`git log ${commitRange} --oneline --no-merges`, { silent: true })
      } catch (error) {
        commits = ''
      }

      if (!commits || commits.length === 0) {
        return '* No changes since last release'
      }

      // Format commits into changelog
      const formattedCommits = commits
        .split('\n')
        .filter(line => line && line.trim().length > 0)
        .map(line => {
          // Remove commit hash and clean up message
          const message = line.replace(/^[a-f0-9]+\s/, '').trim()
          return `* ${message}`
        })
        .join('\n')

      return formattedCommits || '* No changes since last release'
    } catch (error) {
      this.log('⚠️  Could not generate changelog, using placeholder', 'yellow')
      return `* Release ${newVersion}`
    }
  }

  // Create git tag and push
  createGitTag(version) {
    const tagName = `v${version}`

    this.log(`🏷️  Creating git tag: ${tagName}`, 'cyan')

    try {
      // Configure git to handle line endings properly
      this.exec('git config core.autocrlf input', { silent: true })

      // Add files with explicit line ending handling
      this.exec('git add package.json', { silent: false })
      this.exec('git add app.json', { silent: false })

      // Check if there are actually changes to commit
      const status = this.exec('git status --porcelain package.json app.json', { silent: true })

      if (status && status.length > 0) {
        this.exec(`git commit -m "chore: bump version to ${version}"`)
      } else {
        this.log('ℹ️  No changes to commit (version files already up to date)', 'cyan')
      }

      this.exec(`git tag -a ${tagName} -m "Release ${version}"`)

      this.log('📤 Pushing to remote...', 'cyan')
      this.exec('git push origin HEAD')
      this.exec(`git push origin ${tagName}`)

    } catch (error) {
      this.log(`❌ Git operations failed: ${error.message}`, 'red')
      throw error
    }
  }

  // Create GitHub release
  async createGitHubRelease(version, changelog) {
    const tagName = `v${version}`

    this.log('🚀 Creating GitHub release...', 'cyan')

    // Check if GitHub CLI is installed
    try {
      this.exec('gh --version', { silent: true })
    } catch (error) {
      this.log('❌ GitHub CLI (gh) is not installed. Please install it first:', 'red')
      this.log('   brew install gh  # macOS', 'yellow')
      this.log('   or visit: https://cli.github.com/', 'yellow')
      return
    }

    // Check if user is authenticated
    try {
      this.exec('gh auth status', { silent: true })
    } catch (error) {
      this.log('❌ Not authenticated with GitHub CLI. Please run: gh auth login', 'red')
      return
    }

    try {
      // Create release notes file
      const releaseNotesPath = path.join(this.rootDir, 'RELEASE_NOTES.md')
      const releaseNotes = `# Release ${version}

## What's Changed

${changelog}

**Full Changelog**: https://github.com/[your-username]/tawsil-app/compare/v${this.getCurrentVersion()}...${tagName}
`

      fs.writeFileSync(releaseNotesPath, releaseNotes)

      // Create GitHub release
      this.exec(`gh release create ${tagName} --title "Release ${version}" --notes-file RELEASE_NOTES.md`)

      // Clean up
      fs.unlinkSync(releaseNotesPath)

      this.log(`✅ GitHub release created successfully!`, 'green')
      this.log(`🌐 View at: https://github.com/[your-username]/tawsil-app/releases/tag/${tagName}`, 'blue')
    } catch (error) {
      this.log('❌ Failed to create GitHub release', 'red')
      this.log('You can create it manually at: https://github.com/[your-username]/tawsil-app/releases', 'yellow')
    }
  }

  // Main release process
  async run() {
    this.log('🚀 Melon App Release Creator', 'bright')
    this.log('================================', 'bright')

    // Pre-flight checks
    this.checkGitStatus()

    const currentBranch = this.getCurrentBranch()
    this.log(`📍 Current branch: ${currentBranch}`, 'cyan')

    if (currentBranch !== 'main' && currentBranch !== 'master') {
      const proceed = await this.question(`⚠️  You're not on main/master branch. Continue? (y/N): `)
      if (proceed.toLowerCase() !== 'y') {
        this.log('Aborted.', 'yellow')
        this.rl.close()
        return
      }
    }

    const currentVersion = this.getCurrentVersion()
    this.log(`📦 Current version: ${currentVersion}`, 'cyan')

    // Ask for version bump type
    this.log('\nSelect version bump type:', 'bright')
    this.log('1. Patch (bug fixes) - e.g., 1.0.0 → 1.0.1', 'cyan')
    this.log('2. Minor (new features) - e.g., 1.0.0 → 1.1.0', 'cyan')
    this.log('3. Major (breaking changes) - e.g., 1.0.0 → 2.0.0', 'cyan')

    const choice = await this.question('\nEnter choice (1-3): ')

    let bumpType
    switch (choice.trim()) {
      case '1':
        bumpType = 'patch'
        break
      case '2':
        bumpType = 'minor'
        break
      case '3':
        bumpType = 'major'
        break
      default:
        this.log('❌ Invalid choice. Aborted.', 'red')
        this.rl.close()
        return
    }

    const newVersion = this.incrementVersion(currentVersion, bumpType)
    this.log(`🎯 New version: ${newVersion}`, 'green')

    // Generate changelog preview
    const changelog = this.generateChangelog(newVersion)
    this.log('\n📝 Changelog preview:', 'bright')
    this.log(changelog, 'cyan')

    // Final confirmation
    const confirm = await this.question(`\n🤔 Create release ${newVersion}? (y/N): `)
    if (confirm.toLowerCase() !== 'y') {
      this.log('Aborted.', 'yellow')
      this.rl.close()
      return
    }

    try {
      // Update version files
      this.updatePackageJson(newVersion)
      this.updateAppJson(newVersion)

      // Create git tag and push
      this.createGitTag(newVersion)

      // Create GitHub release
      await this.createGitHubRelease(newVersion, changelog)

      this.log('\n🎉 Release completed successfully!', 'green')
      this.log(`📦 Version: ${newVersion}`, 'cyan')
      this.log(`🏷️  Tag: v${newVersion}`, 'cyan')

    } catch (error) {
      this.log(`❌ Release failed: ${error.message}`, 'red')
      process.exit(1)
    } finally {
      this.rl.close()
    }
  }
}

// Run the script
if (require.main === module) {
  const releaseManager = new ReleaseManager()
  releaseManager.run().catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })
}

module.exports = ReleaseManager
