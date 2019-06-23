import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  readyToRender = false;
  apps = [];
  build_history = [];
  selected_apps_idx;
  selected_app;
  config = {};
  meta_data = {};
  api_server;

  constructor(public app: AppService, private route: ActivatedRoute) {
    this.selected_apps_idx = this.route.snapshot.params['apps_idx'];
    console.log('this.selected_apps_idx =' + this.selected_apps_idx);
    this.config = environment;
    this.api_server = this.app.getValue('api_server');
  }


  clickLogout() {
    const result = confirm('logout?');
    if (result) {
      this.app.removeValue('user_id');
      this.app.goReplace('login');
    }
  }


  ngOnInit() {
    if (!this.app.getValue('user_id')) {
      this.app.goReplace('login');
      return;
    }

    this.refreshData();
  }

  async clickBuild() {
    console.log('will trigger = ' + this.selected_apps_idx);
    const temp = await this.app.service.trigger_app_build(this.selected_apps_idx);
    this.refreshData();
  }

  async clickApp(app) {
    this.selected_app = app;
    this.selected_apps_idx = app.apps_idx;

    this.app.go('main/' + this.selected_apps_idx);
  }

  async refreshData() {
    this.readyToRender = false;
    this.meta_data = await this.app.service.select_meta_data();
    const temp = await this.app.service.select_apps();
    if (temp.items) {
      this.apps = temp.items;
    }


    console.log('apps =', this.apps);
    if (!this.selected_apps_idx) {
      if (this.apps.length > 0) {
        this.clickApp(this.apps[0]);
      }
    }
    else {
      this.selected_app = this.findItem(this.selected_apps_idx);
      console.log('selected app = ', this.selected_app);
      this.clickApp(this.selected_app);
      await this.refreshBuildList();
    }

    this.readyToRender = true;
  }

  findItem(target_idx) {

    for (let i = 0; i < this.apps.length; i++) {
      if (Number(target_idx) === Number(this.apps[i].apps_idx)) {
        return this.apps[i];
      }
    }
  }


  async refreshBuildList() {
    this.build_history = [];
    if (this.selected_app) {
      const temp = await this.app.service.find_build_list(this.selected_apps_idx, 0, 1000);
      if (temp.items) {
        this.build_history = temp.items;
      }
      console.log('this.build_history =', this.build_history);
    }
  }

  async clickEnable(apps_version_idx) {
    await this.app.service.update_current_app_version(this.selected_apps_idx, apps_version_idx);
    this.refreshData();
  }

}
