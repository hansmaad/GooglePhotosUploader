import { FileSystemEntry } from '../file-system';

export interface QueueItemSettings {
    albumId: string;
    albumName: string;
    maxSize: number;
}

export type QueueItemStatus = 'pending'|'resizing'|'uploading'|'done';

export interface QueueItem {
    name: string;
    added: Date;
    entry: FileSystemEntry;
    settings: QueueItemSettings;
    uploadSize: number;
    size: number;
    originalDimensions?: string;
    uploadDimensions?: string;
    progress: number;
    status: QueueItemStatus;
}
