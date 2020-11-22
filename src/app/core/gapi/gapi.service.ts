import { Injectable } from '@angular/core';


export interface Profile {
    name: string;
    image: string;
    isSignedIn: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class GapiService {

    private _resolveInit: () => any;
    private initialized = new Promise(res => this._resolveInit = res);

    constructor() { }

    async init(): Promise<any> {
        return new Promise((res, rej) => {
            const gapiScript = document.createElement('script');
            gapiScript.src = 'https://apis.google.com/js/api.js';
            document.body.appendChild(gapiScript);
            gapiScript.addEventListener('load', () => {
                gapi.load('client:auth2', async () => {
                    try {
                        await initClient();
                        res();
                        this._resolveInit();
                    }
                    catch (e) {
                        rej(e);
                    }
                });
            });
        });
    }

    signIn() {
        const GoogleAuth = gapi.auth2.getAuthInstance();
        return GoogleAuth.signIn();
    }

    selectAccount() {
        const GoogleAuth = gapi.auth2.getAuthInstance();
        return GoogleAuth.signIn({ prompt: 'select_account' });
    }

    signOut() {
        const GoogleAuth = gapi.auth2.getAuthInstance();
        return GoogleAuth.signOut();
    }

    getProfile(): Profile {
        const GoogleAuth = gapi.auth2.getAuthInstance();
        const user = GoogleAuth.currentUser.get();
        const profile = user.getBasicProfile();
        if (profile) {
            return {
                name: profile.getName(),
                image: profile.getImageUrl(),
                isSignedIn: user.isSignedIn(),
            };
        }
    }
}

async function initClient() {
    await gapi.client.init({
        // 'discoveryDocs': [discoveryUrl],
        'clientId': '723326092466-s01v86offiej51q62nk66olbnvi2p6a3.apps.googleusercontent.com',
        // 'fetch_basic_profile': true,
        'scope': 'profile https://www.googleapis.com/auth/photoslibrary',
    });
}
