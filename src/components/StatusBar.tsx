import React from 'react';
import { Box, Text } from 'ink';
import { Panel } from '../types/index.js';

interface StatusBarProps {
  selectedBucket: string | null;
  objectCount: number;
  activePanel: Panel;
  isLoading: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  selectedBucket,
  objectCount,
  activePanel,
  isLoading,
}) => {
  return (
    <Box borderStyle="single" borderTop={true} paddingX={1}>
      <Box justifyContent="space-between" width="100%">
        <Box>
          <Text color="cyan">
            Bucket: {selectedBucket || 'None selected'}
          </Text>
          {selectedBucket && (
            <Text color="yellow">
              {' '}Objects: {objectCount}
            </Text>
          )}
        </Box>
        
        <Box>
          <Text color="green">
            Panel: {activePanel === 'buckets' ? 'Buckets' : 'Objects'}
          </Text>
          {isLoading && (
            <Text color="blue">
              {' '}Loading...
            </Text>
          )}
        </Box>
        
        <Box>
          <Text color="gray">
            Press ? for help | q to quit
          </Text>
        </Box>
      </Box>
    </Box>
  );
};