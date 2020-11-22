import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectFilesComponent } from './select-files/select-files.component';
import { UploadRoutingModule } from './upload-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FileBrowserComponent } from './select-files/file-browser/file-browser.component';
import { FileFolderEntryComponent } from './select-files/file-browser/file-folder-entry.component';
import { FormsModule } from '@angular/forms';
import { UploadLayoutComponent } from './upload-layout/upload-layout.component';
import { UploadQueueComponent } from './upload-queue/upload-queue.component';
import { ImagePreviewComponent } from './select-files/image-preview/image-preview.component';
import { UploadSettingsComponent } from './select-files/upload-settings/upload-settings.component';


@NgModule({
    declarations: [
        SelectFilesComponent,
        FileBrowserComponent,
        FileFolderEntryComponent,
        UploadLayoutComponent,
        UploadQueueComponent,
        ImagePreviewComponent,
        UploadSettingsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        UploadRoutingModule
    ]
})
export class UploadModule { }
