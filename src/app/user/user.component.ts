import { Component, OnInit } from '@angular/core';
import { Profile, GapiService } from '../core/gapi/gapi.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent implements OnInit {

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
        await this.gapiService.selectAccount();
        this.profile = this.gapiService.getProfile();
    }

    async signOut() {
        await this.gapiService.signOut();
        this.profile = null;
    }
}
