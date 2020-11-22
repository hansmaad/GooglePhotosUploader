import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileSystemEntry, getNewFiles } from '../file-system';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

    private folders: FileSystemEntry[];
    private folders$: BehaviorSubject<FileSystemEntry[]>;

    constructor(private storage: StorageService) {
    }

    get() {
        if (!this.folders) {
            this.folders = [];
            this.folders$ = new BehaviorSubject<FileSystemEntry[]>(this.folders);
            this.storage.getFolders().then(folders => {
                if (folders) {
                    this.folders = folders;
                    this.folders$.next(this.folders);
                }
            }, () => {});
        }
        return this.folders$.asObservable();
    }

    async add(files: FileSystemEntry|FileSystemEntry[]) {
        files = Array.isArray(files) ? files : [files];
        this.folders = await addNewFolders(this.folders, files);
        await this.save();
        this.folders$.next(this.folders);
    }

    remove(entry: FileSystemEntry) {
        const index = this.folders.indexOf(entry);
        this.folders = this.folders.slice();
        this.folders.splice(index, 1);
        this.folders$.next(this.folders);
        this.save();
    }

    private async save() {
        await this.storage.saveFolders(this.folders);
    }
}

const addNewFolders = async (destination: FileSystemEntry[], files: FileSystemEntry[]) => {
    const newFiles = await getNewFiles(destination, files);
    return destination.concat(newFiles);
};
