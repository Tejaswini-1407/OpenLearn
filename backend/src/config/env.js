import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const environmentPath = path.resolve(currentDirectory, '../../.env');
const result = dotenv.config({ path: environmentPath, quiet: true });
if (result.error && result.error.code !== 'ENOENT') throw new Error('Unable to load the backend environment configuration.');
export default environmentPath;