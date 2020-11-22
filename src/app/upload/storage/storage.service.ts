import { Injectable } from '@angular/core';
import { FileSystemEntry } from '../file-system';
import { QueueItem } from '../upload-queue/queue-item';
import { get, Migration, openDB, put } from './db';


const USR_STORE = 'usr';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private db_: Promise<IDBDatabase>;

    constructor() {
    }

    private db() {
        if (!this.db_) {
            this.db_ = openDB({
                name: name,
                version: 1,
                migration,
                versionConflictHandler: () => alert('Code is outdated, please reload the page.'),
            });
        }
        return this.db_;
    }

    getFolders(): Promise<FileSystemEntry[]> {
        const folders = get<FileSystemEntry[]>(this.db(), USR_STORE, 'folders');
        return folders;
    }

    saveFolders(folders: FileSystemEntry[]) {
        put(this.db(), USR_STORE, folders, 'folders');
    }

    getQueue(): Promise<QueueItem[]> {
        const queue = get<QueueItem[]>(this.db(), USR_STORE, 'queue');
        return queue;
    }

    saveQueue(queue: QueueItem[]) {
        put(this.db(), USR_STORE, queue, 'queue');
    }
}


const migration: Migration = (db, oldVersion, newVersion) => {
    console.log('Migrate from ', oldVersion, 'to', newVersion);
    if (!db.objectStoreNames.contains(USR_STORE)) {
        db.createObjectStore(USR_STORE);
    }
};
