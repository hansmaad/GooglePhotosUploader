import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FileSystemEntry } from '../../file-system';
import { SelectEvent } from './file-folder-entry.component';

@Injectable({
    providedIn: 'root'
})
export class FileBrowserService {

    select$ = new Subject<SelectEvent>();
    preview$ = new Subject<FileSystemEntry>();

    constructor() { }
}
