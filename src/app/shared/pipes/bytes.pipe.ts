import { formatNumber } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bytes'
})
export class BytesPipe implements PipeTransform {

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    transform(value: number, ...args: unknown[]): unknown {
        if (typeof value !== 'number') {
            return '';
        }
        const unit = args[0] || '';
        if (unit === 'MB') {
            value = value / 1024 / 1024;
        }
        else if (unit === 'KB') {
            value = value / 1024;
        }
        return formatNumber(value, this.locale, '1.2-2') + (unit ? ` ${unit}` : '');
    }

}
