import { Injectable } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { AlertController, NavController, LoadingController, ActionSheetController } from '@ionic/angular';

import { environment } from "src/environments/environment";

import { Platform } from '@ionic/angular';
import { RestApiService } from "./app.rest";
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AppService {



    constructor(
        private plt: Platform,
        private router: Router,

        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private loadingCtrl: LoadingController,

        public actionSheetCtrl: ActionSheetController,
        private rest: RestApiService

    ) { }

    // public go(url, data?) {
    //     if (data) {
    //         this.router.navigate([url, data]);
    //         console.log("go with data");
    //     } else {
    //         this.router.navigate([url]);
    //     }
    // }

    public go(url) {

        this.navCtrl.navigateForward(url);
    }

    public goReplace(url) {
        this.navCtrl.navigateRoot(url);
    }

    public goBack() {
        this.navCtrl.back();
    }
    public setValue(key, value) {
        window.localStorage.setItem(key, value);
    }

    public getValue(key) {
        return window.localStorage.getItem(key);
    }
    public removeValue(key) {
        window.localStorage.removeItem(key);
    }



    public goExternal(fullUrl) {
        if (this.isApp()) {
            window.open(fullUrl, '_system');
        } else {
            window.location.replace(fullUrl)
        }
    }






    /**
     * platform : android, ios, browser
     */
    public getPlatform() {
        if (this.plt.is('cordova')) {
            if (this.plt.is('ios')) {
                return 'ios';
            }
            else if (this.plt.is('android')) {
                return 'android';
            }
        }
        else {
            return 'browser';
        }
    }

    /**
     * 웹인지 앱인지 구분
     */
    public isApp() {
        return this.getPlatform() !== 'browser';
    }



    public util = {
        validEmail: (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },

        getSpacedBarcode: (text) => {
            if (text) {
                return text.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
            } else {
                return '';
            }
        },

        getFullHost: () => {
            if (this.plt.is('cordova')) {
                const href = window.location.href;
                const index1 = href.indexOf('#');
                const index2 = href.substr(0, index1).lastIndexOf('/');
                return href.substr(0, index2 + 1);
            }
            return window.location.protocol + '//' + window.location.hostname
                + (window.location.port ? ':' + window.location.port : '')
                + '/';
        },


    }

    public ctrl = {
        loading: async (message?) => {
            const loading = await this.loadingCtrl.create({
                message: message ? message : '조회중..',
            });
            await loading.present();
            return loading;
        },

        alert: async (message) => {
            const alert = await this.alertCtrl.create({
                message: message,
                buttons: [{
                    cssClass: 'primary',
                    text: '확인'
                }]
            });
            await alert.present();
        },

        alertCallback: async (message, cb) => {
            const alert = await this.alertCtrl.create({
                message: message,
                buttons: [{
                    cssClass: 'primary',
                    text: '확인'
                }]
            });
            alert.onDidDismiss().then(() => {
                cb();
            });

            await alert.present();
        },

        alertConfirmCallback: async (message, yesText, noText, yesCb, noCb) => {
            const alert = await this.alertCtrl.create({
                message: message,
                buttons: [

                    {
                        cssClass: 'primary',
                        text: yesText,
                        handler: yesCb
                    },
                    {
                        role: 'cancel',
                        text: noText,
                        cssClass: 'secondary',
                        handler: noCb
                    }
                ]
            });
            await alert.present();
        },

        alertFormat: async (title, subheader, message) => {
            const alert = await this.alertCtrl.create({
                header: title,
                subHeader: subheader,
                message: message,
                buttons: [{
                    cssClass: 'primary',
                    text: '확인'
                }]
            });

            await alert.present();
        },
    }


    /* 
        service for app customized
    */
    public service = {




        //브랜드 목록 가져오기
        select_app_version_list: async (page_no, count_per_page) => {
            return await this.rest.get(this.getValue('api_server') + '/apps/select_app_version_list/' + page_no + '/' + count_per_page).toPromise();
        },

        //request build
        trigger_app_build: async (apps_idx) => {
            return await this.rest.get(this.getValue('api_server') + '/apps/trigger_app_build/' + apps_idx).toPromise();
        },

        //select_meta_data
        select_meta_data: async () => {
            return await this.rest.get(this.getValue('api_server') + '/apps/select_meta_data').toPromise();
        },

        //select_meta_data
        update_current_app_version: async (apps_idx, apps_version_idx) => {
            return await this.rest.post(this.getValue('api_server') + '/apps/update_current_app_version', { apps_idx: apps_idx, apps_version_idx: apps_version_idx }).toPromise();
        },

        //select_meta_data
        login: async (user_id, password) => {
            return await this.rest.post(this.getValue('api_server') + '/apps/login', { user_id: user_id, password: password }).toPromise();
        },
        new_app: async (value) => {
            return await this.rest.post(this.getValue('api_server') + '/apps/new_app', value).toPromise();
        },
        update_app: async (value) => {
            return await this.rest.post(this.getValue('api_server') + '/apps/update_app', value).toPromise();
        },
        delete_app: async (apps_idx) => {
            return await this.rest.post(this.getValue('api_server') + '/apps/delete_app', { apps_idx: apps_idx }).toPromise();
        },
        get_app: async (apps_idx) => {
            return await this.rest.post(this.getValue('api_server') + '/apps/get_app', { apps_idx: apps_idx }).toPromise();
        },
        select_apps: async () => {
            return await this.rest.post(this.getValue('api_server') + '/apps/select_apps', {}).toPromise();
        },
        find_build_list: async (apps_idx, page_no, count_per_page) => {
            return await this.rest.post(this.getValue('api_server') + '/apps/find_build_list', { apps_idx: apps_idx, page_no: page_no, count_per_page: count_per_page }).toPromise();
        },

    }


}