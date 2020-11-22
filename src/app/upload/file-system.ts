

export type PermissionState = 'granted' | 'denied' | 'prompt';

export interface FileSystemHandle {
    readonly name: string;
    readonly kind: 'directory'|'file';
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
    queryPermission(): Promise<PermissionState>;
    requestPermission(): Promise<PermissionState>;
}

export interface FileSystemFileHandle extends FileSystemHandle {
    readonly kind: 'file';
    getFile(): Promise<File>;
}

export interface FileSystemDirectoryHandle extends FileSystemHandle {
    readonly kind: 'directory';
    values(): FileSystemHandle[];
}



export interface FileSystemEntry {
    name: string;
    path: FileSystemEntry[];
    handle: FileSystemHandle;
    isDirectory: boolean;
    entries: FileSystemEntry[];
    selected?: boolean;
}

export async function openFolder(): Promise<FileSystemEntry> {
    const w = window as any;
    const dirHandle: FileSystemDirectoryHandle = await w.showDirectoryPicker();
    return await getEntry(dirHandle, []);
}

async function getEntry(handle: FileSystemHandle, path: FileSystemEntry[]) {
    const entry: FileSystemEntry = {
        name: handle.name,
        path,
        entries: [],
        isDirectory: isDirectory(handle),
        handle,
    };
    if (isDirectory(handle)) {
        const directoryHandle = handle as FileSystemDirectoryHandle;
        for await (const e of directoryHandle.values()) {
            entry.entries.push(await getEntry(e, path.concat(entry)));
        }
    }
    entry.entries = cleanupEntries(entry.entries);
    return entry;
}

const isDirectory = (handle) => handle.kind === 'directory';

function cleanupEntries(entries: FileSystemEntry[]) {
    return entries
        .filter(e => {
            return e.isDirectory || isPhoto(e);
        })
        .sort((a, b) => {
            if (isDirectory(a) === isDirectory(b)) {
                return a.name.localeCompare(b.name);
            }
            return isDirectory(a) ? 1 : -1;
        });
}

function isPhoto(entry: FileSystemEntry) {
    const ext = entry.name.split('.').pop().toLocaleLowerCase();
    return ext === 'jpg' || ext === 'jpeg';
}

export function countFiles(entry: FileSystemEntry) {
    if (entry.isDirectory) {
        return entry.entries.reduce((count, e) => count + countFiles(e), 0);
    }
    return 1;
}

export function getSelection(entry: FileSystemEntry): FileSystemEntry[] {
    if (entry.isDirectory) {
        return entry.entries.reduce((selection, e) => {
            const s = getSelection(e);
            return selection.concat(s);
        }, []);
    }
    return entry.selected ? [entry] : [];
}

export async function getFile(entry: FileSystemEntry): Promise<File> {
    const handle = entry.handle as FileSystemFileHandle;
    if (!(await verifyPermission(handle))) {
        throw new Error('No permission to access the file.');
    }
    return handle.getFile();
}

export async function verifyPermission(fileHandle: FileSystemHandle) {
    if ((await fileHandle.queryPermission()) === 'granted') {
      return true;
    }
    if ((await fileHandle.requestPermission()) === 'granted') {
      return true;
    }
    return false;
}

/**
 * Returns a subset of the files argument. The returned array will only contain entries
 * that are not part of the existingFiles array. Only the direct entries of existingFiles
 * are checked.
 */
export async function getNewFiles(existingFiles: readonly FileSystemEntry[], files: readonly FileSystemEntry[]) {
    const promises = files.map(f => hasSameEntry(existingFiles, f));
    const hasSameEntryValues = await Promise.all(promises);
    return hasSameEntryValues.filter(hasSame => !hasSame).map((_, i) => files[i]);
}

/**
 * Returns true if newEntry already exists in entries.
 */
const hasSameEntry = async (entries: readonly FileSystemEntry[], newEntry: FileSystemEntry) => {
    const promises = entries.map(e => e.handle.isSameEntry(newEntry.handle));
    const isSameEntryValues = await Promise.all(promises);
    return isSameEntryValues.includes(true);
};

