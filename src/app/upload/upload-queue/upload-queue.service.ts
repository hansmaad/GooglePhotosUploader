import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileSystemEntry, getFile, getNewFiles } from '../file-system';
import { StorageService } from '../storage/storage.service';
import { QueueItem, QueueItemSettings, QueueItemStatus } from './queue-item';

@Injectable({
  providedIn: 'root'
})
export class UploadQueue {

    private queue: QueueItem[];
    private queue$: BehaviorSubject<QueueItem[]>;

    constructor(private storage: StorageService) {
    }

    get() {
        if (!this.queue) {
            this.queue = [];
            this.queue$ = new BehaviorSubject<QueueItem[]>(this.queue);
            this.storage.getQueue().then(queue => {
                if (queue) {
                    this.restore(queue);
                }
            }, () => {});
        }
        return this.queue$.asObservable();
    }

    private restore(items: QueueItem[]) {
        for (const item of items) {
            item.status = 'pending';
        }
        this.queue = items;
        this.queue$.next(this.queue);
    }

    async add(files: FileSystemEntry[], settings: QueueItemSettings) {
        const newFiles = await getNewFiles(this.queue.map(q => q.entry), files);
        const newItems = newFiles.map<QueueItem>(file => ({
            name: file.path.map(p => p.name).join('/') + '/' + file.name,
            added: new Date(),
            entry: file,
            settings,
            size: 0,
            progress: 0,
            status: 'pending',
            uploadFile: null,
            uploadSize: null,
        }));
        this.queue.push(...newItems);
        this.queue.sort(queueOrder);
        this.queue$.next(this.queue);
        await loadSizes(newItems);
        this.save();
    }

    clear() {
        this.queue = [];
        this.queue$.next(this.queue);
        this.save();
    }

    async save() {
        await this.storage.saveQueue(this.queue.filter(item => item.status !== 'done'));
    }
}


async function loadSizes(items: QueueItem[]) {
    for (const item of items) {
        const file = await getFile(item.entry);
        item.size = file.size;
    }
}

function queueOrder(a: QueueItem, b: QueueItem) {
    if (a.progress !== b.progress) {
        return (b.progress || 0) - (a.progress || 0);
    }
    const albumA = a.settings.albumId || '';
    const albumB = b.settings.albumId || '';
    return albumA.localeCompare(albumB);
}
