import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, tap, map } from 'rxjs/operators';

import { Observable, of, throwError } from 'rxjs';
import { AppService } from '../app.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  readyToRender = false;
  items = [];
  search: String;
  limit = 100;
  page_no = 0;
  total_page_count;
  total_item_count;
  isLoading = false;
  meta = {};
  snapshot;

  api_server;

  constructor(public app: AppService) {

    this.api_server = this.app.getValue('api_server');


  }

  async clickSaveEndPoint(value) {
    if (!value.startsWith('http')) {
      this.app.setValue('api_server', 'http://' + value);
    }
    else {
      this.app.setValue('api_server', value);
    }

    this.api_server = value;

    await this.refreshData();
  }

  clickEditEndPoint() {
    this.app.removeValue('api_server');
    this.api_server = null;

    // this.refreshData();
  }

  async ngOnInit() {
    this.refreshData();
  }

  async clickChange(event, item) {
    if (this.snapshot == item.snapshot) {
      return;
    }
    this.snapshot = item.snapshot;
    console.log('clickChange = ' + item.build_history_idx + ", " + event.target.value);
    await this.app.service.update_current_app_version(item.apps_version_idx);
  }

  async getMeta() {
    this.meta = await this.app.service.select_meta_data();
    // console.log('meta = ', JSON.stringify(this.meta));
  }

  async refreshData() {
    this.items = [];
    if (this.api_server) {
      console.log('api -' + this.api_server);
      await this.getMeta();
      this.page_no = 0;
      await this.loadData(true);
    }
    this.readyToRender = true;
  }



  async clickBuild() {
    const temp = await this.app.service.trigger_app_build();
    this.refreshData();
  }


  async loadData(refresh) {
    const self = this;
    this.isLoading = true;

    const temp = await this.app.service.select_app_version_list(this.page_no, this.limit);
    if (refresh) {
      this.items = [];
    }

    // console.log('this.temp = ' + JSON.stringify(temp));
    temp.items.forEach(item => {
      self.items.push(item);
      if (item.enabled) {
        self.snapshot = item.snapshot;
      }
    });

    this.page_no = temp.page_no;
    this.total_page_count = temp.total_page_count;
    this.total_item_count = temp.total_item_count;
    this.isLoading = false;
  }



}
