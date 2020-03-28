import { Component } from '@angular/core';
import { AlertController, LoadingController,MenuController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Router, RouterModule } from '@angular/router';
import { HandlerService } from '../handler.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  showLoader:boolean=true;
  constructor(private alertCtrl: AlertController, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private Handler: HandlerService,
    private menu:MenuController,
    ) {
      this.menu.enable(false)
    }
  ionViewWillLeave() {
      //
      console.log("left  home")
      //this.Handler.dismissLoading()
    }
  CheckAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        this.Handler.dismissLoading();
        this.Handler.cleanOpenApp();
      } else {
        // user not logged in
        this.Handler.dismissLoading();
        this.router.navigateByUrl('/login');
        console.log('user needs to login signup says');
      }
      console.log(this.showLoader+"here i got")
    })
  }
  

  doRefresh(event) {
    console.log("refreshed")
    setTimeout(() => {
      this.CheckAuth()
      event.target.complete();
    }, 2000);
  }
  ngOnInit() {
    var text = "Loading...."
    var time = 5000;
    this.Handler.presentLoading(text,time)
    this.CheckAuth();
  }

}
