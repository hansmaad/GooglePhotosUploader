import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectFilesComponent } from './select-files/select-files.component';
import { UploadQueueComponent } from './upload-queue/upload-queue.component';

const routes: Routes = [
    { path: '', component: SelectFilesComponent },
    { path: 'queue', component: UploadQueueComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadRoutingModule { }
