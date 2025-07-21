import React from 'react';
import { Box, Text } from 'ink';
import { S3Object } from '../types/index.js';
import { S3Service } from '../utils/aws.js';

interface ObjectListProps {
  objects: S3Object[];
  selectedIndex: number;
  searchTerm: string;
  isActive: boolean;
  isLoading: boolean;
  bucketName: string | null;
  viewportStart: number;
  viewportSize: number;
}

export const ObjectList: React.FC<ObjectListProps> = ({
  objects,
  selectedIndex,
  searchTerm,
  isActive,
  isLoading,
  bucketName,
  viewportStart,
  viewportSize,
}) => {
  const filteredObjects = objects.filter(obj =>
    obj.Key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleObjects = filteredObjects.slice(viewportStart, viewportStart + viewportSize);
  const hasMore = filteredObjects.length > viewportStart + viewportSize;
  const showScrollIndicator = filteredObjects.length > viewportSize;

  if (!bucketName) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="yellow">
          📄 Objects {isActive ? '(Active)' : ''}
        </Text>
        <Text color="gray">Select a bucket to view objects</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="yellow">
          📄 Objects {isActive ? '(Active)' : ''}
        </Text>
        <Text>Loading objects from {bucketName}...</Text>
      </Box>
    );
  }

  if (filteredObjects.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="yellow">
          📄 Objects {isActive ? '(Active)' : ''}
        </Text>
        <Text color="gray">
          {objects.length === 0 ? 'No objects in bucket' : 'No objects match search'}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="yellow">
        📄 Objects {isActive ? '(Active)' : ''} - {bucketName}
        {showScrollIndicator && ` (${viewportStart + 1}-${Math.min(viewportStart + viewportSize, filteredObjects.length)} of ${filteredObjects.length})`}
      </Text>
      
      <Box flexDirection="column" marginTop={1}>
        <Box>
          <Text bold color="gray" dimColor>
            {'Key'.padEnd(30)} {'Size'.padEnd(12)} {'Modified'.padEnd(20)} {'Class'}
          </Text>
        </Box>
        
        {visibleObjects.map((obj, index) => {
          const actualIndex = viewportStart + index;
          const isSelected = actualIndex === selectedIndex && isActive;
          const key = obj.Key || 'Unknown';
          const displayKey = key.length > 28 ? key.slice(-28) : key;
          const size = S3Service.formatSize(obj.Size);
          const modified = obj.LastModified 
            ? S3Service.formatDate(obj.LastModified).split(',')[0]
            : 'Unknown';
          const storageClass = obj.StorageClass || 'STANDARD';
          const displayClass = storageClass.length > 10 ? storageClass.slice(0, 10) : storageClass;

          return (
            <Box key={`${obj.Key}-${actualIndex}`}>
              <Text
                color={isSelected ? 'black' : 'white'}
                backgroundColor={isSelected ? 'yellow' : undefined}
                bold={isSelected}
              >
                {displayKey.padEnd(30)} {size.padEnd(12)} {modified.padEnd(20)} {displayClass}
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
          Total: {filteredObjects.length} object{filteredObjects.length !== 1 ? 's' : ''}
        </Text>
      </Box>
    </Box>
  );
};