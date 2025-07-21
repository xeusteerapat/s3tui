AI Agent Instructions: AWS S3 Terminal UI Application
Objective
Create a terminal-based user interface (TUI) application that allows users to browse AWS S3 buckets and objects in a read-only table format with search capabilities.
Core Requirements
1. AWS Authentication

Primary: Accept AWS credentials as command-line arguments or environment variables

--access-key-id or AWS_ACCESS_KEY_ID
--secret-access-key or AWS_SECRET_ACCESS_KEY
--region or AWS_DEFAULT_REGION (default: us-east-1)
--session-token or AWS_SESSION_TOKEN (optional, for temporary credentials)


Fallback: Use default AWS credentials from ~/.aws/credentials if no explicit credentials provided
Error Handling: Display clear error messages for authentication failures

2. User Interface Design

Framework: Use Ink (https://github.com/vadimdemedes/ink) - React for interactive command-line apps
Language: Node.js/TypeScript with React components
Layout: Component-based split-screen interface using Ink's Box component

Bucket List View: Left panel component showing all accessible S3 buckets
Object List View: Right panel component showing objects in selected bucket


Navigation: Keyboard-driven navigation using Ink's useInput hook
State Management: Use React hooks (useState, useEffect, useContext) for application state

3. Table Structure
Bucket Table Columns:

Bucket Name
Creation Date
Region
Object Count (if feasible to fetch efficiently)

Object Table Columns:

Object Key (file path)
Size (human-readable format: KB, MB, GB)
Last Modified Date
Storage Class
ETag (truncated)

4. Search Functionality

Bucket Search: Real-time filtering of bucket list by bucket name
Object Search: Real-time filtering of object list by object key/path
Search Input: Dedicated search box or inline filtering
Case Sensitivity: Implement case-insensitive search by default
Regex Support: Optional advanced search with regex patterns

5. Core Features

Read-Only: No modification, upload, or delete operations
Pagination: Handle large object lists efficiently (load objects in chunks)
Sorting: Allow sorting by any column (name, date, size)
Refresh: Manual refresh capability (F5 or 'r' key)
Help: Built-in help screen (F1 or '?' key) showing all keyboard shortcuts

6. Performance Considerations

Lazy Loading: Load bucket contents only when selected
Async Operations: Use asynchronous calls for AWS API requests
Progress Indicators: Show loading spinners for long operations
Caching: Cache bucket/object lists temporarily to reduce API calls
Rate Limiting: Respect AWS API rate limits

7. Error Handling

Network connectivity issues
Permission denied errors
Invalid bucket names
Empty buckets
API rate limit exceeded
Malformed AWS credentials

8. Keyboard Controls (Suggested)
Navigation:
- Arrow Keys: Move selection up/down/left/right
- Enter: Select bucket or dive into object details
- Tab: Switch between bucket and object panels
- Escape: Go back or exit

Search:
- /: Activate search mode
- Escape: Clear search and return to normal mode

General:
- F1 or ?: Show help
- F5 or r: Refresh current view
- q: Quit application
- Ctrl+C: Force quit
9. Configuration Options

Config File: Support for optional config file (~/.s3tui.conf)
Command Line Options:
--profile <aws-profile>    # Use specific AWS profile
--region <region>          # Override default region  
--no-color                 # Disable colored output
--limit <number>           # Limit objects per page
--help                     # Show usage information


10. Output Requirements

Responsive Design: Adapt to different terminal sizes
Color Coding: Use colors to distinguish file types, sizes, or status
Status Bar: Show current bucket, object count, and connection status
Breadcrumb Navigation: Show current location in S3 hierarchy