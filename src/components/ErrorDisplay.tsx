import React from 'react';
import { Box, Text } from 'ink';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
}) => {
  return (
    <Box flexDirection="column" padding={2}>
      <Text bold color="red">
        ❌ Error
      </Text>
      
      <Box marginTop={1} flexDirection="column">
        <Text color="red">
          {error}
        </Text>
      </Box>

      <Box marginTop={2}>
        <Text color="gray">
          Press r to retry | q to quit
        </Text>
      </Box>
    </Box>
  );
};