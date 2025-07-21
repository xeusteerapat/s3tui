import { Command } from 'commander';
import { AppConfig } from '../types/index.js';

export function parseCliArgs(): AppConfig {
	const program = new Command();

	program
		.name('s3tui')
		.description('AWS S3 Terminal UI - Browse S3 buckets and objects')
		.version('1.0.0')
		.option('--access-key-id <key>', 'AWS Access Key ID')
		.option('--secret-access-key <secret>', 'AWS Secret Access Key')
		.option('--session-token <token>', 'AWS Session Token')
		.option('--region <region>', 'AWS Region', 'us-east-1')
		.option('--profile <profile>', 'AWS Profile')
		.option('--no-color', 'Disable colored output')
		.option('--limit <number>', 'Limit objects per page', parseInt)
		.parse();

	const options = program.opts();

	return {
		accessKeyId: options.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey:
			options.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
		sessionToken: options.sessionToken || process.env.AWS_SESSION_TOKEN,
		region: options.region || process.env.AWS_DEFAULT_REGION || 'us-east-1',
		profile: options.profile,
		noColor: options.noColor || false,
		limit: options.limit || 1000,
	};
}
