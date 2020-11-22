import { Component, OnInit } from '@angular/core';
import { GapiService } from './core/gapi/gapi.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    loading: boolean;

    constructor(private gapiService: GapiService) {
    }

    async ngOnInit() {
        this.loading = true;
        try {
            await this.gapiService.init();
        }
        finally {
            this.loading = false;
        }
    }

}

