import { supabase } from '../../supabase.js';

function parseStorageRef(sourceRef) {
    if (!sourceRef || typeof sourceRef !== 'string') {
        throw new Error('Missing storage reference');
    }
    const trimmed = sourceRef.startsWith('storage:')
        ? sourceRef.slice('storage:'.length)
        : sourceRef;
    const cleaned = trimmed.replace(/^\/+/, '');
    const parts = cleaned.split('/').filter(Boolean);
    const bucket = parts.shift();
    const path = parts.join('/');
    if (!bucket || !path) {
        throw new Error('Invalid storage reference');
    }
    return { bucket, path };
}

export async function downloadStorageRef(sourceRef) {
    if (!supabase) {
        throw new Error('Supabase client not initialized');
    }
    const { bucket, path } = parseStorageRef(sourceRef);
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
        throw error;
    }
    const filename = path.split('/').pop() || 'template';
    return { blob: data, filename, bucket, path };
}
