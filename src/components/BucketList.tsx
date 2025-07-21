import React from 'react';
import { Box, Text } from 'ink';
import { S3Bucket } from '../types/index.js';
import { S3Service } from '../utils/aws.js';

interface BucketListProps {
  buckets: S3Bucket[];
  selectedIndex: number;
  searchTerm: string;
  isActive: boolean;
  isLoading: boolean;
}

export const BucketList: React.FC<BucketListProps> = ({
  buckets,
  selectedIndex,
  searchTerm,
  isActive,
  isLoading,
}) => {
  const filteredBuckets = buckets.filter(bucket =>
    bucket.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="cyan">
          📦 Buckets {isActive ? '(Active)' : ''}
        </Text>
        <Text>Loading buckets...</Text>
      </Box>
    );
  }

  if (filteredBuckets.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="cyan">
          📦 Buckets {isActive ? '(Active)' : ''}
        </Text>
        <Text color="gray">No buckets found</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        📦 Buckets {isActive ? '(Active)' : ''}
      </Text>
      
      <Box flexDirection="column" marginTop={1}>
        <Box>
          <Text bold color="gray" dimColor>
            {'Name'.padEnd(25)} {'Region'.padEnd(15)} {'Created'}
          </Text>
        </Box>
        
        {filteredBuckets.map((bucket, index) => {
          const isSelected = index === selectedIndex && isActive;
          const bucketName = bucket.Name || 'Unknown';
          const region = bucket.Region || 'Unknown';
          const created = bucket.CreationDate 
            ? S3Service.formatDate(bucket.CreationDate).split(',')[0]
            : 'Unknown';

          return (
            <Box key={bucket.Name || index}>
              <Text
                color={isSelected ? 'black' : 'white'}
                backgroundColor={isSelected ? 'cyan' : undefined}
                bold={isSelected}
              >
                {bucketName.padEnd(25)} {region.padEnd(15)} {created}
              </Text>
            </Box>
          );
        })}
      </Box>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Total: {filteredBuckets.length} bucket{filteredBuckets.length !== 1 ? 's' : ''}
        </Text>
      </Box>
    </Box>
  );
};