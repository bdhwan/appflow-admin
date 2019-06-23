import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {



  constructor(private app: AppService) {

  }

  ngOnInit() {
  }


  async clickLogin(api_server, user_id, password) {
    console.log('user_id = ', user_id);
    console.log('password = ', password);
    this.app.setValue('api_server', api_server);
    const result = await this.app.service.login(user_id, password);
    if (result) {
      this.app.setValue('user_id', user_id);
    }
    console.log('result = ', result);
    this.app.goReplace('main');
  }

}
