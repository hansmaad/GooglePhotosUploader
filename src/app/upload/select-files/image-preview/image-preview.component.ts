import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
    selector: 'app-image-preview',
    templateUrl: './image-preview.component.html',
})
export class ImagePreviewComponent implements OnChanges, OnDestroy {

    @Input() file: File;

    imgSrc: SafeUrl;
    imgSrc2: SafeUrl;

    private imgUrl: string;
    private imgUrl2: string;

    constructor(private sanitizer: DomSanitizer) {
    }

    onInit() {
    }

    ngOnDestroy() {
        this.cleanup();
    }

    private cleanup() {
        if (this.imgUrl) {
            URL.revokeObjectURL(this.imgUrl);
        }
        if (this.imgUrl2) {
            URL.revokeObjectURL(this.imgUrl2);
        }
    }

    ngOnChanges() {
        this.cleanup();
        if (this.file) {
            this.imgUrl = URL.createObjectURL(this.file);
            this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(this.imgUrl);
            // this.resize();
        }
    }

    // private async resize() {
    //     const reducer = new ImageBlobReduce();
    //     const reduced = await reducer.toBlob(this.file, { max: 300 } );
    //     this.imgUrl2 = URL.createObjectURL(reduced);
    //     this.imgSrc2 = this.sanitizer.bypassSecurityTrustUrl(this.imgUrl2);
    // }

}
