export interface S3Bucket {
  Name?: string;
  CreationDate?: Date;
  Region?: string;
  ObjectCount?: number;
}

export interface S3Object {
  Key?: string;
  Size?: number;
  LastModified?: Date;
  StorageClass?: string;
  ETag?: string;
}

export interface AppConfig {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  region: string;
  profile?: string;
  noColor?: boolean;
  limit?: number;
}

export interface AppState {
  buckets: S3Bucket[];
  objects: S3Object[];
  selectedBucket: string | null;
  selectedBucketIndex: number;
  selectedObjectIndex: number;
  bucketSearchTerm: string;
  objectSearchTerm: string;
  isLoading: boolean;
  error: string | null;
  activePanel: 'buckets' | 'objects';
  showHelp: boolean;
}

export type Panel = 'buckets' | 'objects';