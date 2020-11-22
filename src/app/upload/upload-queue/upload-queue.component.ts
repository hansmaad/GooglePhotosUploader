import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UploadService, UploadStatus } from '../upload.service';
import { QueueItem } from './queue-item';
import { UploadQueue } from './upload-queue.service';



@Component({
    selector: 'app-upload-queue',
    templateUrl: './upload-queue.component.html',
})
export class UploadQueueComponent implements OnInit, OnDestroy {

    items$: Observable<QueueItem[]>;
    uploadStatus$: Observable<UploadStatus>;

    totalFiles: number;
    pendingFiles: number;

    private unsubscribe$ = new Subject();

    constructor(private queue: UploadQueue, private upload: UploadService) { }

    ngOnInit(): void {
        this.items$ = this.queue.get();
        this.uploadStatus$ = this.upload.status();
        combineLatest([this.items$, this.uploadStatus$]).pipe(takeUntil(this.unsubscribe$)).subscribe((values) => {
            const items = values[0];
            const pendingItems = items.filter(item => !item.progress);
            this.pendingFiles = pendingItems.length;
            this.totalFiles = items.length;
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    start() {
        this.upload.start();
    }

    pause() {
        this.upload.pause();
    }

    clear() {
        this.queue.clear();
    }
}
