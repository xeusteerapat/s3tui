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
    showHelp: false
  });

  const [s3Service] = useState(() => new S3Service(config));

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
        setState((prev: AppState) => ({
          ...prev,
          selectedBucketIndex: Math.max(0, prev.selectedBucketIndex - 1)
        }));
      } else {
        setState((prev: AppState) => ({
          ...prev,
          selectedObjectIndex: Math.max(0, prev.selectedObjectIndex - 1)
        }));
      }
    }

    if (key.downArrow) {
      if (state.activePanel === 'buckets') {
        setState((prev: AppState) => ({
          ...prev,
          selectedBucketIndex: Math.min(prev.buckets.length - 1, prev.selectedBucketIndex + 1)
        }));
      } else {
        setState((prev: AppState) => ({
          ...prev,
          selectedObjectIndex: Math.min(prev.objects.length - 1, prev.selectedObjectIndex + 1)
        }));
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