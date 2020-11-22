import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): unknown {
        if (typeof value !== 'string') {
            return '';
        }
        const size = args[0] || '200';
        return value + `=w${size}-h${size}-c`;
    }

}
