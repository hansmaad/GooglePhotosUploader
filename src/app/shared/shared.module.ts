import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBtnComponent } from './user/user-btn/user-btn.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { IconDirective } from './icon.directive';
import { BytesPipe } from './pipes/bytes.pipe';
import { ImageUrlPipe } from './pipes/image-url.pipe';

const exportedComponents = [
    UserBtnComponent,
    LayoutComponent,
    IconDirective,
    BytesPipe,
    ImageUrlPipe,
];

@NgModule({
    declarations: [
        ...exportedComponents,
    ],
    exports: [
        ...exportedComponents
    ],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class SharedModule { }
