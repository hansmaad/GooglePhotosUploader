import { Component, OnInit } from '@angular/core';
import { GapiService, Profile } from 'src/app/core/gapi/gapi.service';

@Component({
    selector: 'app-user-btn',
    templateUrl: './user-btn.component.html'
})
export class UserBtnComponent implements OnInit {

    profile: Profile;
    loading = false;

    constructor(private gapiService: GapiService) {
    }

    async ngOnInit() {
        this.loading = true;
        try {
            this.profile = this.gapiService.getProfile();
        }
        finally {
            this.loading = false;
        }
    }

    async signIn() {
        await this.gapiService.signIn();
        this.profile = this.gapiService.getProfile();
    }
}
