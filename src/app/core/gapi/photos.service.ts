import { Injectable } from '@angular/core';


export interface AlbumResult {
    albums: Album[];
    hasMore: boolean;
    loadMore?(): Promise<AlbumResult>;
}

export interface Album {
    id: string;
    title: string;
    productUrl: string;
    coverPhotoBaseUrl: string;
    isWriteable: boolean;
}


export interface MediaItem {
    uploadToken: string;
    fileName: string;
}


@Injectable({
    providedIn: 'root'
})
export class PhotosService {

    private albums: Promise<AlbumResult>;

    getAlbums(): Promise<AlbumResult> {
        if (!this.albums) {
            return this.loadAlbums();
        }
        return this.albums;
    }

    loadAlbums(): Promise<AlbumResult> {
        this.albums = this.loadMoreAlbums(undefined);
        return this.albums;
    }

    private async loadMoreAlbums(nextPageToken?: string): Promise<AlbumResult> {
        const response = await loadAlbums(nextPageToken);
        if (response.status !== 200 || !response.result.albums) {
            return {
                albums: [],
                hasMore: false,
            };
        }
        const albums = response.result.albums;
        const hasMore = response.result.nextPageToken;
        const loadMore = hasMore ? () => this.loadMoreAlbums(response.result.nextPageToken) : undefined;
        return {
            albums,
            hasMore,
            loadMore,
        };
    }

    async uploadImage(file: File, fileName: string, progress?: (percent: number) => any) {
        // POST https://photoslibrary.googleapis.com/v1/uploads
        // Authorization: Bearer oauth2-token
        // Content-type: application/octet-stream
        // X-Goog-Upload-Content-Type: mime-type
        // X-Goog-Upload-Protocol: raw
        const uploadToken = await uploadImage(file, progress);
        return { uploadToken };

    }

    createMediaItems(items: MediaItem[], albumId?: string) {
        return createMediaItems(items, albumId);
    }

    async createAlbum(title: string) {
        const response = await gapi.client.request({
            path: 'https://photoslibrary.googleapis.com/v1/albums',
            method: 'POST',
            body: {
                album: { title }
            }
        });
        const result: Album = response.result;
        return result;
    }
}

function loadAlbums(pageToken?: string) {
    return gapi.client.request({
        path: 'https://photoslibrary.googleapis.com/v1/albums',
        method: 'GET',
        params: {
            pageToken
        }
    });
}

function uploadImage(file: File, progress?: (percent: number) => any): Promise<string> {
    return new Promise((res, rej) => {
        const body = file.slice();
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    res(xhr.responseText);
                }
                else {
                    rej(xhr.status);
                }
            }
        };
        if (xhr.upload) {
            xhr.upload.onprogress = (p) => {
                if (progress) {
                    progress(p.loaded / (p.total || 1));
                }
            };
        }
        xhr.open('POST', 'https://photoslibrary.googleapis.com/v1/uploads');
        xhr.setRequestHeader('Content-type', 'application/octet-stream');
        xhr.setRequestHeader('X-Goog-Upload-Content-Type', 'mime-type');
        xhr.setRequestHeader('X-Goog-Upload-Protocol', 'raw');
        xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
        xhr.send(body);

    });
}

async function createMediaItems(items: MediaItem[], albumId?: string) {
    // POST https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate
    // Content-type: application/json
    // Authorization: Bearer oauth2-token

    const body = {
        albumId,
        newMediaItems: items.map(item => ({
            description: item.fileName,
            simpleMediaItem: {
                fileName: item.fileName,
                uploadToken: item.uploadToken,
            }
        })),
    };

    const response = await gapi.client.request({
        path: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
        method: 'POST',
        body
    });

    console.log(response);
}
