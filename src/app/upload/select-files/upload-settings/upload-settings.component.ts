import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Album, PhotosService } from 'src/app/core/gapi/photos.service';

export interface UploadSettings {
    albumName: string;
    albumId: string;
    resize: boolean;
    maxSize: number;
}


@Component({
    selector: 'app-upload-settings',
    templateUrl: './upload-settings.component.html'
})
export class UploadSettingsComponent implements OnInit {

    @Output() close = new EventEmitter<UploadSettings>();

    settings: UploadSettings = {
        albumName: '',
        albumId: '',
        resize: true,
        maxSize: 4000,
    };
    selectedAlbum: Album;
    albums: Album[] = [];
    loadingAlbums = true;
    creatingAlbum = false;
    loadingAlbum = false;
    newAlbumName = '';

    constructor(private photoService: PhotosService) { }

    async ngOnInit() {
        try {
            let load = () => this.photoService.getAlbums();
            while (true) {
                const response = await load();
                [].push.apply(this.albums, response.albums);
                if (!response.hasMore) {
                    break;
                }
                load = response.loadMore;
            }
        }
        finally {
            this.loadingAlbums = false;
        }
    }

    selectAlbum(album: Album) {
        if (album.isWriteable) {
            this.selectedAlbum = album;
            this.settings.albumId = album.id;
            this.settings.albumName = album.title;
        }
    }

    async createAlbum() {
        if (this.creatingAlbum) {
            if (this.newAlbumName) {
                this.loadingAlbum = true;
                try {
                    const newAlbum = await this.photoService.createAlbum(this.newAlbumName);
                    this.albums.unshift(newAlbum);
                    this.selectAlbum(newAlbum);
                    this.creatingAlbum = false;
                }
                finally {
                    this.loadingAlbum = false;
                }
            }
        }
        else {
            this.creatingAlbum = true;
        }
    }
}
