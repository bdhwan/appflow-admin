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
      git_full_name: new FormControl(this.data.git_full_name),
      git_user_id: new FormControl(this.data.git_user_id),
      git_user_pw: new FormControl(this.data.git_user_pw),
      git_web_url: new FormControl(this.data.git_web_url),
      git_web_user_id: new FormControl(this.data.git_web_user_id),
      git_web_user_pw: new FormControl(this.data.git_web_user_pw),
      endpoint: new FormControl(this.data.endpoint),
      cache_url: new FormControl(this.data.cache_url),
      auto_update: new FormControl(this.data.auto_update),
      android_link: new FormControl(this.data.android_link),

      ios_link: new FormControl(this.data.ios_link)
    });
    this.readyToRender = true;
  }

  onBlurGitUrl() {
    console.log('onBlurGitUrl -' + this.registerForm.value.git_url);
    const git_full_name = this.app.util.extractFullName(this.registerForm.value.git_url);
    const git_url = this.app.util.extractGitUrl(this.registerForm.value.git_url);

    this.registerForm.patchValue({
      git_full_name: git_full_name,
      git_url: git_url
    })
  }


  onBlurWebGitUrl() {
    const git_web_url = this.app.util.extractGitUrl(this.registerForm.value.git_web_url);

    this.registerForm.patchValue({
      git_web_url: git_web_url
    })
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
