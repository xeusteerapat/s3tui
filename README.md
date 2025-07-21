# S3TUI - AWS S3 Terminal User Interface

A terminal-based user interface for browsing AWS S3 buckets and objects.

## Features

- 📦 Browse S3 buckets with details (name, region, creation date)
- 📄 View objects in selected buckets (key, size, last modified, storage class)
- ⌨️ Keyboard navigation between buckets and objects
- 🔍 Search functionality (planned feature)
- 📊 Status bar with current context
- ❓ Built-in help screen
- 🔧 Read-only interface (no modifications)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Usage

### Command Line Options

```bash
# Basic usage with AWS credentials
./dist/index.js --access-key-id YOUR_KEY --secret-access-key YOUR_SECRET --region us-west-2

# Using environment variables
AWS_ACCESS_KEY_ID=your_key AWS_SECRET_ACCESS_KEY=your_secret ./dist/index.js

# With session token (for temporary credentials)
./dist/index.js --access-key-id YOUR_KEY --secret-access-key YOUR_SECRET --session-token YOUR_TOKEN

# Using AWS profile
./dist/index.js --profile my-profile

# Limit objects per page
./dist/index.js --limit 500
```

### Keyboard Controls

#### Navigation
- **↑/↓** - Move selection up/down
- **Tab** - Switch between buckets and objects panel
- **Enter** - Select bucket (when in buckets panel)
- **Esc** - Go back or exit help

#### General
- **?** - Show help screen
- **r** - Refresh current view
- **q** - Quit application
- **Ctrl+C** - Force quit

### Environment Variables

The application supports these environment variables:
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_SESSION_TOKEN` - Session token (for temporary credentials)
- `AWS_DEFAULT_REGION` - Default AWS region

## Development

### Run in development mode:
```bash
npm run dev
```

### Build for production:
```bash
npm run build
```

## Requirements

- Node.js 18+
- Valid AWS credentials with S3 read permissions
- Terminal that supports ANSI colors

## Architecture

- **Ink** - React for interactive command-line apps
- **AWS SDK v3** - AWS S3 client
- **TypeScript** - Type safety
- **Commander.js** - CLI argument parsing

## License

ISC