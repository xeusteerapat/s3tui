import {
	S3Client,
	ListBucketsCommand,
	ListObjectsV2Command,
	GetBucketLocationCommand,
} from '@aws-sdk/client-s3';
import { AppConfig, S3Bucket, S3Object } from '../types/index.js';

export class S3Service {
	private client: S3Client;
	private bucketCache = new Map<string, S3Object[]>();
	private bucketRegionCache = new Map<string, string>();
	private regionalClients = new Map<string, S3Client>();
	private config: AppConfig;

	constructor(config: AppConfig) {
		this.config = config;
		this.client = new S3Client({
			region: config.region,
			credentials:
				config.accessKeyId && config.secretAccessKey
					? {
							accessKeyId: config.accessKeyId,
							secretAccessKey: config.secretAccessKey,
							sessionToken: config.sessionToken,
					  }
					: undefined,
		});
	}

	private getRegionalClient(region: string): S3Client {
		if (!this.regionalClients.has(region)) {
			const regionalClient = new S3Client({
				region: region,
				credentials:
					this.config.accessKeyId && this.config.secretAccessKey
						? {
								accessKeyId: this.config.accessKeyId,
								secretAccessKey: this.config.secretAccessKey,
								sessionToken: this.config.sessionToken,
						  }
						: undefined,
			});
			this.regionalClients.set(region, regionalClient);
		}
		return this.regionalClients.get(region)!;
	}

	async listBuckets(): Promise<S3Bucket[]> {
		try {
			const command = new ListBucketsCommand({});
			const response = await this.client.send(command);

			const buckets = response.Buckets || [];
			const bucketsWithDetails = await Promise.all(
				buckets.map(async (bucket) => {
					let region = 'us-east-1';
					try {
						if (bucket.Name) {
							const locationCommand = new GetBucketLocationCommand({
								Bucket: bucket.Name,
							});
							const locationResponse = await this.client.send(locationCommand);
							region = locationResponse.LocationConstraint || 'us-east-1';
							this.bucketRegionCache.set(bucket.Name, region);
						}
					} catch (error) {
						console.warn(
							`Could not get region for bucket ${bucket.Name}:`,
							error
						);
					}

					return {
						...bucket,
						Region: region,
						ObjectCount: 0,
					};
				})
			);

			return bucketsWithDetails;
		} catch (error) {
			throw new Error(`Failed to list buckets: ${(error as Error).message}`);
		}
	}

	async listObjects(bucketName: string, limit?: number): Promise<S3Object[]> {
		if (this.bucketCache.has(bucketName)) {
			return this.bucketCache.get(bucketName)!;
		}

		try {
			// Get the bucket region first
			let bucketRegion = this.bucketRegionCache.get(bucketName);
			if (!bucketRegion) {
				try {
					const locationCommand = new GetBucketLocationCommand({
						Bucket: bucketName,
					});
					const locationResponse = await this.client.send(locationCommand);
					bucketRegion = locationResponse.LocationConstraint || 'us-east-1';
					this.bucketRegionCache.set(bucketName, bucketRegion);
				} catch (error) {
					// Fallback to default region if we can't get the bucket location
					bucketRegion = this.config.region;
				}
			}

			// Use the regional client for this bucket
			const regionalClient = this.getRegionalClient(bucketRegion);
			
			const command = new ListObjectsV2Command({
				Bucket: bucketName,
				MaxKeys: limit || 1000,
			});

			const response = await regionalClient.send(command);
			const objects = response.Contents || [];

			this.bucketCache.set(bucketName, objects);
			return objects;
		} catch (error) {
			throw new Error(
				`Failed to list objects in bucket ${bucketName}: ${
					(error as Error).message
				}`
			);
		}
	}

	clearCache(): void {
		this.bucketCache.clear();
		this.bucketRegionCache.clear();
		this.regionalClients.clear();
	}

	static formatSize(bytes?: number): string {
		if (!bytes) return '0 B';

		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(1)} ${units[unitIndex]}`;
	}

	static formatDate(date?: Date): string {
		if (!date) return '';
		return date.toLocaleString();
	}

	static truncateETag(etag?: string): string {
		if (!etag) return '';
		const cleaned = etag.replace(/"/g, '');
		return cleaned.length > 12 ? `${cleaned.slice(0, 12)}...` : cleaned;
	}
}
