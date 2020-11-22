
import * as ImageBlobReduce from 'image-blob-reduce';


export interface ResizeResult {
    original: File;
    resized: File;
    originalWidth: number;
    originalHeight: number;
    width: number;
    height: number;
}

interface ImageResizeItem {
    file: File;
    maxSize: number;
}

export function resizeImages(items: ImageResizeItem[]): Promise<ResizeResult>[] {
    const reducer = new ImageBlobReduce();
    const results: Promise<ResizeResult>[] = [];
    reducer.after('_calculate_size', (env) => {
        const result = env.opts.result;
        result.originalWidth = env.image.width;
        result.originalHeight = env.image.height;
        result.width = env.transform_width;
        result.height = env.transform_height;
        return env;
    });

    for (const item of items) {
        const result = {
            original: item.file,
        } as ResizeResult;

        results.push(new Promise(async res => {
            result.resized = await reducer.toBlob(item.file, { max: item.maxSize, result } );
            res(result);
        }));
    }

    return results;
}
