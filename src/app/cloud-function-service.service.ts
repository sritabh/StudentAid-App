import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class CloudFunctionProvider {
  constructor(public http: HttpClient) {
    console.log('Hello CloudFunctionCallProvider Provider');
  }

  callHelloFunction() {
    return new Promise<any>((resolve, reject) => {
      this.http.get('https://asia-east2-login-session-a9776.cloudfunctions.net/isDaddy').subscribe((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
