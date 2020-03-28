import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { AlertController,PopoverController, LoadingController } from '@ionic/angular';
import { HandlerService } from '../handler.service';
import { ProfileManagerComponent } from '../profile-manager/profile-manager.component';
import { SendUpdateComponent } from '../send-update/send-update.component';
@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.page.html',
  styleUrls: ['./user-manager.page.scss'],
})
export class UserManagerPage implements OnInit {
  getDate:string;
  sortUser:string="Name";
  currUser:any;
  users_on_screen:number=10;
  users:any = [ ];
  userName:any=[ ];
  i:number=5;
  constructor(
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController, 
    public Handler: HandlerService,
    private popOverCtrl:PopoverController,
    private loadingCtrl: LoadingController,
    ) { }
  test() {
    console.log("test");
    this.localNotifications.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      data: { secret: "Assignment" }
    });
  }
  loadElements(event) {
    if (this.users_on_screen < this.users.length) {
      setTimeout(() => {
        //console.log('Done');
        this.users_on_screen += 10;
        event.target.complete();
      }, 500);
    }
    else {
      event.target.complete();
    }
  }
  viewUsers() {
    const users = firebase.database().ref('USERS');
    users.on(('value'),data => {
      const user = data.val()
      var value = Object.entries(user);
      //console.log(value)
      var sortable=[];
      for (var i=0;i<value.length;i++) {
        sortable.push([value[i][1]['Profile']['Name'],value[i]]);
        //console.log(await value[i][1]['Profile']['Name'])
      }
      sortable.sort((a,b) => {
        if (a[0] > b[0]) {
          return 1;
      }
      if (b[0] > a[0]) {
          return -1;
      }
      return 0;
    });
    var sortedName = []
    sortable.forEach(function(item){
      sortedName.push(item[1])
    })
    this.users=sortedName;
    })
  }
  viewProfile(userID) {

    var type = "ViewProfile";
    this.profile(userID)
  }
  sendUpdate() {
    this.sendUpdatePopOver()
  }
  async sendUpdatePopOver() {
    const popover = await this.popOverCtrl.create({
      component:SendUpdateComponent,
      //event: ev,
      translucent: true,
      cssClass: 'editProfileOption'
    });
    return await popover.present();
  }
  async profile(userID) {
    const popover = await this.popOverCtrl.create({
      component:ProfileManagerComponent,
      //event: ev,
      translucent: true,
      componentProps:{userId:userID},
      cssClass: 'editProfileOption'
    });
    return await popover.present();
  }
  doRefresh(event) {
    console.log("refreshed")
    setTimeout(() => {
      this.ngOnInit()
      //console.log("chedck for ver " + this.currUser.emailVerified)
      event.target.complete();
    }, 2000);
  }
  sortingUsers() {
    this.users_on_screen = this.users.length;
  }
  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currUser = user;
      }
      else {
        console.log("Login first");
      }
    })
    //console.log(this.isDaddy)
    this.viewUsers()
  }

}
