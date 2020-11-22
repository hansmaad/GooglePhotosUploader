import { Component, Input, OnInit } from '@angular/core';
import { countFiles, FileSystemEntry } from '../../file-system';
import { FileBrowserService } from './file-browser.service';

export interface SelectEvent {
    entry: FileSystemEntry;
    shiftKey: boolean;
}

@Component({
  selector: 'app-file-folder-entry',
  templateUrl: './file-folder-entry.component.html',
})
export class FileFolderEntryComponent implements OnInit {
    @Input() entry: FileSystemEntry;
    @Input() level: number;

    showEntries = false;
    fileCount: number;

    constructor(private service: FileBrowserService) {
    }

    ngOnInit(): void {
        this.fileCount = countFiles(this.entry);
    }

    toggle() {
        this.showEntries = !this.showEntries;
    }

    onSelect(entry: FileSystemEntry, $event: MouseEvent) {
        this.service.select$.next({
            entry,
            shiftKey: $event.shiftKey,
        });
    }

    async show(e: FileSystemEntry) {
        if (e.isDirectory) {
            return;
        }
        this.service.preview$.next(e);
    }
}
