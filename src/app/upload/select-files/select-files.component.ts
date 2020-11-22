import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileSystemEntry, openFolder, getSelection, getFile } from '../file-system';
import { UploadQueue } from '../upload-queue/upload-queue.service';
import { FileBrowserService } from './file-browser/file-browser.service';
import { SelectEvent } from './file-browser/file-folder-entry.component';
import { FolderService } from './folder.service';
import { UploadSettings } from './upload-settings/upload-settings.component';

@Component({
    selector: 'app-select-files',
    templateUrl: './select-files.component.html',
})
export class SelectFilesComponent implements OnInit, OnDestroy {

    folders: FileSystemEntry[] = [];
    canSelect: boolean;
    loading: boolean;
    showSettings: boolean;

    imageFile: File;

    private selected: FileSystemEntry;
    private selection: FileSystemEntry[];
    private unsubscribe$ = new Subject();

    constructor(private queue: UploadQueue,
        private browserService: FileBrowserService,
        private folderService: FolderService) { }

    ngOnInit() {
        this.folderService.get().pipe(takeUntil(this.unsubscribe$)).subscribe(async folders => {
            this.folders = folders;
        });
        this.browserService.preview$.pipe(takeUntil(this.unsubscribe$)).subscribe(e => this.show(e));
        this.browserService.select$.pipe(takeUntil(this.unsubscribe$)).subscribe(event => this.onSelect(event));
        this.updateSelection();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async openFolder() {
        this.loading = true;
        try {
            const folder = await openFolder();
            this.folderService.add(folder);
        }
        finally {
            this.loading = false;
        }
    }

    onSelect(event: SelectEvent) {
        const { entry, shiftKey } = event;
        if (shiftKey && this.selected) {
            const folder = this.selected.path[this.selected.path.length - 1];
            let startIndex = folder.entries.indexOf(this.selected);
            let endIndex = folder.entries.indexOf(entry);
            if (startIndex > endIndex) {
                const end = endIndex;
                endIndex = startIndex;
                startIndex = end;
            }
            folder.entries.slice(startIndex, endIndex + 1).forEach(selector(this.selected.selected));
        }
        else {
            select(entry, !entry.selected);
        }
        this.selected = entry;
        this.updateSelection();
    }

    private updateSelection() {
        const files = this.folders.map(getSelection);
        this.selection = [].concat.apply([], files);
        this.canSelect = !!this.selection.length;
    }

    upload(settings: UploadSettings) {
        if (settings) {
            this.queue.add(this.selection, {
                albumId: settings.albumId,
                albumName: settings.albumName,
                maxSize: settings.resize ? settings.maxSize : undefined,
            });
            this.selection.forEach(s => s.selected = false);
        }
        this.showSettings = false;
    }

    remove(folder) {
        this.folderService.remove(folder);
    }

    async show(entry: FileSystemEntry) {
        if (!entry) {
            this.imageFile = null;
        }
        if (entry) {
            this.imageFile = await getFile(entry);
        }
    }
}

const selector = (selected: boolean) => (entry: FileSystemEntry) => select(entry, selected);

function select(entry: FileSystemEntry, selected: boolean) {
    entry.selected = selected;
    if (entry.isDirectory) {
        entry.entries.forEach(e => select(e, selected));
    }
}
