import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaItem, PhotosService } from '../core/gapi/photos.service';
import { getFile } from './file-system';
import { resizeImages } from './images';
import { QueueItem } from './upload-queue/queue-item';
import { UploadQueue } from './upload-queue/upload-queue.service';


export interface UploadStatus {
    uploading: boolean;
    currentItem?: QueueItem;
}

interface ChunkItem {
    item: QueueItem;
    file: Promise<File>;
}

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private chunkSize = 5;
    private items: QueueItem[];
    private uploading = false;
    private currentItem: QueueItem;
    private status$ = new BehaviorSubject<UploadStatus>({ uploading: false });

    constructor(private photoService: PhotosService, private queue: UploadQueue) {
        queue.get().subscribe(items => this.items = items.slice());
    }

    status(): Observable<UploadStatus> {
        return this.status$.asObservable();
    }

    async start() {
        this.uploading = true;

        let nextChunkPromise = this.getNextChunk();

        while (this.uploading) {
            const currentChunk = await nextChunkPromise;
            if (!currentChunk.length) {
                this.pause();
                break;
            }
            // Resize the next chunk while current chunk is uploaded
            nextChunkPromise = this.getNextChunk();

            const mediaItems = [];
            for (const item of currentChunk) {
                if (!this.uploading) {
                    break;
                }
                const mediaItem = await this.upload(item);
                mediaItems.push(mediaItem);
            }
            const albumId = currentChunk[0].item.settings.albumId;
            if (mediaItems.length) {
                await this.photoService.createMediaItems(mediaItems, albumId);
                currentChunk.forEach(item => item.item.status = 'done');
                this.queue.save();
            }

        }
        this.queue.save();
    }

    private getNextChunk(): Promise<ChunkItem[]> {
        const pendingItems = this.items.filter(item => item.status === 'pending');
        if (!pendingItems.length) {
            return Promise.resolve([]);
        }
        // All items in a single chunk should share the same albumId
        const albumId = pendingItems[0].settings.albumId;
        const nextChunk = pendingItems
            .filter(item => item.settings.albumId === albumId)
            .slice(0, this.chunkSize);

        return resizeItems(nextChunk);
    }

    private async upload(chunkItem: ChunkItem): Promise<MediaItem> {
        const item = chunkItem.item;
        item.status = 'uploading';
        this.status$.next({
            currentItem: item,
            uploading: true,
        });
        const fileName = chunkItem.item.name;
        const file = await chunkItem.file;
        chunkItem.file = null;
        const { uploadToken } = await this.photoService.uploadImage(
            file, fileName, (p) => chunkItem.item.progress = 100 * p);

        return {
            fileName,
            uploadToken,
        };
    }

    pause() {
        this.uploading = false;
        this.status$.next({
            currentItem: this.currentItem,
            uploading: false,
        });
    }
}


const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));


async function resizeItems(items: QueueItem[]): Promise<ChunkItem[]> {

    items.forEach(c => c.status = 'resizing');

    const files = await Promise.all(items.map(async item => ({
        file: await getFile(item.entry),
        maxSize: item.settings.maxSize,
    })));

    const resizePromises = resizeImages(files).map((promise, i) => promise.then(result => {
        const item = items[i];
        item.uploadSize = result.resized.size;
        item.originalDimensions = `${result.originalWidth}x${result.originalHeight}`;
        item.uploadDimensions = `${result.width}x${result.height}`;
        return result.resized;
    }));

    return items.map((item, i) => ({
        item,
        file: resizePromises[i],
    }));
}


