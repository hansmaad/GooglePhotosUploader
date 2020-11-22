import { BytesPipe } from './bytes.pipe';

describe('BytesPipe', () => {

    let pipe: BytesPipe;

    beforeEach(() => {
        pipe = new BytesPipe('en-US');
    });

    it('should format 0', () => {
        expect(pipe.transform(0)).toBe('0');
    });

    it('should format 1000 to 1,000', () => {
        expect(pipe.transform(1000)).toBe('1,000');
    });

    it('should format to 1,234 MB', () => {
        expect(pipe.transform(1234 * 1024 * 1024, 'MB')).toBe('1,234 MB');
    });

});
