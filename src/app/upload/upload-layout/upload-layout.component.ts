import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadQueue } from '../upload-queue/upload-queue.service';

@Component({
    selector: 'app-upload-layout',
    templateUrl: './upload-layout.component.html',
})
export class UploadLayoutComponent implements OnInit, OnDestroy {

    queueLength?: Observable<number>;
    private unsubscribe = new Subject();

    constructor(private queue: UploadQueue) { }

    ngOnInit() {
        this.queueLength = this.queue.get().pipe(map(queue => queue.length));
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
