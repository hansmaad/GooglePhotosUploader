export type Migration = (db: IDBDatabase, oldVersion: number, newVersion: number) => Promise<any>|void;

export interface DBOpenOptions {
    name: string;
    version: number;
    migration?: Migration;
    versionConflictHandler: () => any;
}


export function openDB(options: DBOpenOptions): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((res, rej) => {
        const openRequest = indexedDB.open(options.name, options.version);
        openRequest.onsuccess = () => {
            const db = openRequest.result;
            db.onversionchange = function() {
                db.close();
                options.versionConflictHandler();
            };
            res(db);
        };
        openRequest.onerror = () => rej(openRequest.error);
        openRequest.onupgradeneeded = async (event) => {
            const db = openRequest.result;
            // The upgrade transaction needs to be completed before we resolve the db.
            const transaction = openRequest.transaction;
            transaction.oncomplete = () => res(db);
            if (options.migration) {
                const result = options.migration(db, event.oldVersion, event.newVersion);
                await Promise.resolve(result);
            }
        };
    });
}

export function deleteDB(name: string): Promise<any> {
    return new Promise((res, rej) => {
        const openRequest = indexedDB.deleteDatabase(name);
        openRequest.onsuccess = res;
        openRequest.onerror = rej;
    });
}

export async function put(dbPromise: Promise<IDBDatabase>|IDBDatabase, storeName: string, obj: any, key?: any): Promise<IDBValidKey> {
    return new Promise(async (res, rej) => {
        const db = await Promise.resolve(dbPromise);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(obj, key);
        request.onsuccess = e => res(request.result);
        request.onerror = () => rej(request.error);
    });
}

export async function get<T>(dbPromise: Promise<IDBDatabase>|IDBDatabase, storeName: string, key: any): Promise<T> {
    return new Promise(async (res, rej) => {
        const db = await Promise.resolve(dbPromise);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = e => res(request.result);
        request.onerror = () => rej(request.error);
    });
}
