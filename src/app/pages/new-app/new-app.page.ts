import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-app',
  templateUrl: './new-app.page.html',
  styleUrls: ['./new-app.page.scss'],
})
export class NewAppPage implements OnInit {
  apps_idx;
  registerForm: FormGroup;
  data: any = {};
  readyToRender = false;

  constructor(public app: AppService,
    private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.apps_idx = this.route.snapshot.params['apps_idx'];
    console.log('apps_idx =', this.apps_idx)
  }

  async ngOnInit() {
    this.readyToRender = false;
    if (this.apps_idx) {
      const temp = await this.app.service.get_app(this.apps_idx);
      console.log('init value =', temp)
      if (temp.app_id) {
        this.data = temp;
      }
    }

    this.registerForm = new FormGroup({
      app_id: new FormControl(this.data.app_id, [Validators.required]),
      channel_name: new FormControl(this.data.channel_name, [Validators.required]),
      git_url: new FormControl(this.data.git_url, [Validators.required]),
      git_user_id: new FormControl(this.data.git_user_id),
      git_user_pw: new FormControl(this.data.git_user_pw),
      endpoint: new FormControl(this.data.endpoint),
      cache_url: new FormControl(this.data.cache_url),
    });
    this.readyToRender = true;
  }

  async onSubmit() {
    console.log("onSubmit =", this.registerForm.value);
    try {
      if (this.apps_idx) {
        this.registerForm.value.apps_idx = this.apps_idx;
        const result = await this.app.service.update_app(this.registerForm.value);
        console.log('result =', result);
        if (result) {
          this.app.goReplace('main');
        }
      }
      else {
        const result = await this.app.service.new_app(this.registerForm.value);
        console.log('result =', result);
        if (result) {
          this.app.goReplace('main');
        }
      }

    } catch (error) {
      alert(error);
    }
  }
}
