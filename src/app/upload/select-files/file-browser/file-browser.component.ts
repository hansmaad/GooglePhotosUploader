import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileSystemEntry } from '../../file-system';
import { FileBrowserService } from './file-browser.service';
import { SelectEvent } from './file-folder-entry.component';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
})
export class FileBrowserComponent implements OnInit, OnDestroy {

    @Input() folder: FileSystemEntry;
    @Output() select = new EventEmitter();

    private selected: FileSystemEntry;
    private unsubscribe$ = new Subject();

    constructor(private service: FileBrowserService) {}

    ngOnInit() {

    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


}



