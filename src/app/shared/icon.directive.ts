import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import {
    mdiFileImageOutline,
    mdiFolderOutline,
    mdiFolderOpenOutline,
    mdiLockOutline,
} from '@mdi/js';


const ICONS = icons({
    mdiFileImageOutline,
    mdiFolderOutline,
    mdiFolderOpenOutline,
    mdiLockOutline
});




function getIcon(kind: string) {
    return ICONS[kind];
}

function icons(set: {[name: string]: string}) {
    const i = {};
    Object.keys(set).forEach(key => {
        i[key.slice(3).toLowerCase()] = set[key];
    });
    return i;
}

function getSize(size: number|string) {
    const s = +size;
    return isNaN(s) ? size.toString() : size + 'px';
}


@Directive({
    selector: '[appIcon]',
})
export class IconDirective implements OnInit {

    @Input('appIcon') kind: string;
    @Input() size: number|string;
    @Input() color?: string;

    data: string;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        const kind = this.kind.replace(/-/g, '').toLowerCase();
        const d = getIcon(kind);
        const element = this.el.nativeElement as SVGSVGElement;
        element.setAttributeNS(null, 'viewBox', '0 0 24 24');
        const size = getSize(this.size || 24);
        element.style.height = size;
        element.style.width = size;
        if (this.color) {
            element.style.color = this.color;
        }
        element.innerHTML = `<path fill="currentColor" d="${d}"></path>`;
    }
}
