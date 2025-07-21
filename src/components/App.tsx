import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { AppState, AppConfig } from '../types/index.js';
import { S3Service } from '../utils/aws.js';
import { BucketList } from './BucketList.js';
import { ObjectList } from './ObjectList.js';
import { StatusBar } from './StatusBar.js';
import { HelpScreen } from './HelpScreen.js';
import { ErrorDisplay } from './ErrorDisplay.js';

interface AppProps {
  config: AppConfig;
}

export const App: React.FC<AppProps> = ({ config }) => {
  const [state, setState] = useState<AppState>({
    buckets: [],
    objects: [],
    selectedBucket: null,
    selectedBucketIndex: 0,
    selectedObjectIndex: 0,
    bucketSearchTerm: '',
    objectSearchTerm: '',
    isLoading: true,
    error: null,
    activePanel: 'buckets',
    showHelp: false,
    objectViewportStart: 0,
    bucketViewportStart: 0
  });

  const [s3Service] = useState(() => new S3Service(config));

  const VIEWPORT_SIZE = 15; // Number of items to show in viewport

  const updateViewport = (
    selectedIndex: number,
    totalItems: number,
    currentViewportStart: number
  ): number => {
    let newViewportStart = currentViewportStart;
    
    // If selection is above viewport, scroll up
    if (selectedIndex < currentViewportStart) {
      newViewportStart = selectedIndex;
    }
    // If selection is below viewport, scroll down
    else if (selectedIndex >= currentViewportStart + VIEWPORT_SIZE) {
      newViewportStart = Math.max(0, selectedIndex - VIEWPORT_SIZE + 1);
    }
    
    // Ensure we don't scroll past the end
    newViewportStart = Math.min(newViewportStart, Math.max(0, totalItems - VIEWPORT_SIZE));
    
    return newViewportStart;
  };

  const loadBuckets = async () => {
    setState((prev: AppState) => ({ ...prev, isLoading: true, error: null }));
    try {
      const buckets = await s3Service.listBuckets();
      setState((prev: AppState) => ({ ...prev, buckets, isLoading: false }));
    } catch (error) {
      setState((prev: AppState) => ({ 
        ...prev, 
        error: (error as Error).message, 
        isLoading: false 
      }));
    }
  };

  const loadObjects = async (bucketName: string) => {
    setState((prev: AppState) => ({ ...prev, isLoading: true, error: null }));
    try {
      const objects = await s3Service.listObjects(bucketName, config.limit);
      setState((prev: AppState) => ({ 
        ...prev, 
        objects, 
        selectedBucket: bucketName,
        selectedObjectIndex: 0,
        objectViewportStart: 0,
        isLoading: false 
      }));
    } catch (error) {
      setState((prev: AppState) => ({ 
        ...prev, 
        error: (error as Error).message, 
        isLoading: false 
      }));
    }
  };

  useEffect(() => {
    loadBuckets();
  }, []);

  useInput((input: string, key: any) => {
    if (state.showHelp) {
      if (key.escape || input === 'q') {
        setState((prev: AppState) => ({ ...prev, showHelp: false }));
      }
      return;
    }

    switch (input) {
      case 'q':
        process.exit(0);
        break;
      case '?':
        setState((prev: AppState) => ({ ...prev, showHelp: true }));
        break;
      case 'r':
        if (state.selectedBucket) {
          loadObjects(state.selectedBucket);
        } else {
          loadBuckets();
        }
        break;
      case '/':
        break;
    }

    if (key.tab) {
      setState((prev: AppState) => ({
        ...prev,
        activePanel: prev.activePanel === 'buckets' ? 'objects' : 'buckets'
      }));
      return;
    }

    if (key.upArrow) {
      if (state.activePanel === 'buckets') {
        setState((prev: AppState) => {
          const newIndex = Math.max(0, prev.selectedBucketIndex - 1);
          const newViewportStart = updateViewport(newIndex, prev.buckets.length, prev.bucketViewportStart);
          return {
            ...prev,
            selectedBucketIndex: newIndex,
            bucketViewportStart: newViewportStart
          };
        });
      } else {
        setState((prev: AppState) => {
          const newIndex = Math.max(0, prev.selectedObjectIndex - 1);
          const newViewportStart = updateViewport(newIndex, prev.objects.length, prev.objectViewportStart);
          return {
            ...prev,
            selectedObjectIndex: newIndex,
            objectViewportStart: newViewportStart
          };
        });
      }
    }

    if (key.downArrow) {
      if (state.activePanel === 'buckets') {
        setState((prev: AppState) => {
          const newIndex = Math.min(prev.buckets.length - 1, prev.selectedBucketIndex + 1);
          const newViewportStart = updateViewport(newIndex, prev.buckets.length, prev.bucketViewportStart);
          return {
            ...prev,
            selectedBucketIndex: newIndex,
            bucketViewportStart: newViewportStart
          };
        });
      } else {
        setState((prev: AppState) => {
          const newIndex = Math.min(prev.objects.length - 1, prev.selectedObjectIndex + 1);
          const newViewportStart = updateViewport(newIndex, prev.objects.length, prev.objectViewportStart);
          return {
            ...prev,
            selectedObjectIndex: newIndex,
            objectViewportStart: newViewportStart
          };
        });
      }
    }

    if (key.return && state.activePanel === 'buckets') {
      const selectedBucket = state.buckets[state.selectedBucketIndex];
      if (selectedBucket?.Name) {
        loadObjects(selectedBucket.Name);
        setState((prev: AppState) => ({ ...prev, activePanel: 'objects' }));
      }
    }
  });

  if (state.showHelp) {
    return <HelpScreen />;
  }

  if (state.error) {
    return <ErrorDisplay error={state.error} onRetry={loadBuckets} />;
  }

  return (
    <Box flexDirection="column" height="100%">
      <Box flexGrow={1} flexDirection="row">
        <Box width="50%" borderStyle="single" borderRight={true}>
          <BucketList
            buckets={state.buckets}
            selectedIndex={state.selectedBucketIndex}
            searchTerm={state.bucketSearchTerm}
            isActive={state.activePanel === 'buckets'}
            isLoading={state.isLoading && state.buckets.length === 0}
            viewportStart={state.bucketViewportStart}
            viewportSize={VIEWPORT_SIZE}
          />
        </Box>
        <Box width="50%" borderStyle="single">
          <ObjectList
            objects={state.objects}
            selectedIndex={state.selectedObjectIndex}
            searchTerm={state.objectSearchTerm}
            isActive={state.activePanel === 'objects'}
            isLoading={state.isLoading && state.selectedBucket !== null}
            bucketName={state.selectedBucket}
            viewportStart={state.objectViewportStart}
            viewportSize={VIEWPORT_SIZE}
          />
        </Box>
      </Box>
      <StatusBar
        selectedBucket={state.selectedBucket}
        objectCount={state.objects.length}
        activePanel={state.activePanel}
        isLoading={state.isLoading}
      />
    </Box>
  );
};