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
  viewportStart: number;
  viewportSize: number;
}

export const BucketList: React.FC<BucketListProps> = ({
  buckets,
  selectedIndex,
  searchTerm,
  isActive,
  isLoading,
  viewportStart,
  viewportSize,
}) => {
  const filteredBuckets = buckets.filter(bucket =>
    bucket.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleBuckets = filteredBuckets.slice(viewportStart, viewportStart + viewportSize);
  const hasMore = filteredBuckets.length > viewportStart + viewportSize;
  const showScrollIndicator = filteredBuckets.length > viewportSize;

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
        {showScrollIndicator && ` (${viewportStart + 1}-${Math.min(viewportStart + viewportSize, filteredBuckets.length)} of ${filteredBuckets.length})`}
      </Text>
      
      <Box flexDirection="column" marginTop={1}>
        <Box>
          <Text bold color="gray" dimColor>
            {'Name'.padEnd(25)} {'Region'.padEnd(15)} {'Created'}
          </Text>
        </Box>
        
        {visibleBuckets.map((bucket, index) => {
          const actualIndex = viewportStart + index;
          const isSelected = actualIndex === selectedIndex && isActive;
          const bucketName = bucket.Name || 'Unknown';
          const region = bucket.Region || 'Unknown';
          const created = bucket.CreationDate 
            ? S3Service.formatDate(bucket.CreationDate).split(',')[0]
            : 'Unknown';

          return (
            <Box key={bucket.Name || actualIndex}>
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
        
        {showScrollIndicator && viewportStart > 0 && (
          <Box>
            <Text color="gray" dimColor>↑ More items above</Text>
          </Box>
        )}
        
        {showScrollIndicator && hasMore && (
          <Box>
            <Text color="gray" dimColor>↓ More items below</Text>
          </Box>
        )}
      </Box>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Total: {filteredBuckets.length} bucket{filteredBuckets.length !== 1 ? 's' : ''}
        </Text>
      </Box>
    </Box>
  );
};