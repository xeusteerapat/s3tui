import React from 'react';
import { Box, Text } from 'ink';

export const HelpScreen: React.FC = () => {
  return (
    <Box flexDirection="column" padding={2}>
      <Text bold color="cyan">
        🔧 S3TUI - Help
      </Text>
      
      <Box flexDirection="column" marginTop={1}>
        <Text bold color="yellow">Navigation:</Text>
        <Text>  ↑/↓  - Move selection up/down</Text>
        <Text>  Tab  - Switch between buckets and objects panel</Text>
        <Text>  Enter - Select bucket (when in buckets panel)</Text>
        <Text>  Esc  - Go back or exit help</Text>
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text bold color="yellow">Search:</Text>
        <Text>  /    - Activate search mode (planned feature)</Text>
        <Text>  Esc  - Clear search and return to normal mode</Text>
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text bold color="yellow">General:</Text>
        <Text>  ?    - Show this help screen</Text>
        <Text>  r    - Refresh current view</Text>
        <Text>  q    - Quit application</Text>
        <Text>  Ctrl+C - Force quit</Text>
      </Box>

      <Box flexDirection="column" marginTop={1}>
        <Text bold color="yellow">Information:</Text>
        <Text>  • Buckets panel shows all accessible S3 buckets</Text>
        <Text>  • Objects panel shows contents of selected bucket</Text>
        <Text>  • Status bar shows current context and navigation hints</Text>
        <Text>  • Application is read-only - no modifications possible</Text>
      </Box>

      <Box marginTop={2}>
        <Text color="gray">
          Press Esc or q to close this help screen
        </Text>
      </Box>
    </Box>
  );
};