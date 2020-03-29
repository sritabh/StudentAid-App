import { Component } from '@angular/core';
import { AlertController,MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/messaging';
import { HandlerService } from './handler.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FCM } from '@ionic-native/fcm/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  database_branch: string;
  database_name: string;
  isCertified: boolean;
  version: string="1.1.1";
  appPages: any = [];
  isDaddy: string;
  public appPages_Certified = [
    {
      title: 'Add Assignments/News/Notes',
      url: '/add-events',
      icon: 'create'
    },
    {
      title: 'Assignments/News',
      url: '/view-events',
      icon: 'paper'
    },
    {
      title: 'Notes',
      url: '/notes',
      icon: 'bookmarks'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information'
    }
  ];
  public appPages_notCertified = [
    {
      title: 'Assignments/News',
      url: '/view-events',
      icon: 'paper'
    },
    {
      title: 'Notes',
      url: '/notes',
      icon: 'bookmarks'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information'
    }
  ];
  public appPages_forDaddy = [
    {
      title: 'Add Assignments/News/Notes',
      url: '/add-events',
      icon: 'create'
    },
    {
      title: 'Assignments/News',
      url: '/view-events',
      icon: 'paper'
    },
    {
      title: 'Notes',
      url: '/notes',
      icon: 'bookmarks'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'User Manager',
      url: '/user-manager',
      icon: 'people'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information'
    }
  ];
// Initialize Firebase
  firebaseConfig = {
    apiKey: "AIzaSyC1GRxLEasReoJitiqtewBky3uncio7jSI",
    authDomain: "studentaidbysobydamn.firebaseapp.com",
    databaseURL: "https://studentaidbysobydamn.firebaseio.com",
    projectId: "studentaidbysobydamn",
    storageBucket: "studentaidbysobydamn.appspot.com",
    messagingSenderId: "60726927345",
    appId: "1:60726927345:web:c86f8867cb77f8a0b8ae50",
    measurementId: "G-YX8DLXC6VN"
};
  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public Handler: HandlerService,
    private router: Router,
    private http: HttpClient,
    public fcm: FCM,
    private backgroundMode: BackgroundMode,
    private menu:MenuController,
  ) {
    this.initializeApp();
    /**
     *     
     this.localNotifications.on('click').subscribe(notification =>{
      console.log("notification clicked")
      this.router.navigateByUrl('/view-events');
    })
     */
    
  }
  
  LogOut() {
    firebase.auth().signOut().then(function() {
      console.log('loggetOut');
    }).catch(function(error) {
      console.log(error);
    });
    this.router.navigateByUrl('/login');
    }
  checkUpdateAlert() {
    let popup_message = firebase.database().ref('UPDATE');
    popup_message.on('value', async (data) => {
      let message = data.val();
      //console.log(message);
      const alert = await this.alertCtrl.create({
        header: message.Title,
        message: message.message,
        backdropDismiss: false,
        buttons: [
          {
            text: message.button_left, // ok button
            handler: (blah) => {
              window.open(message.link);
            }
          }, {
            text: message.button_right, // cancel button
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }
        ]
      });
      let available_version = message.version;
      if (this.version != available_version) {
        await alert.present();
      } else {
       await alert.dismiss();
      }
      // await alert.present();
    });

  }
  ngOnInit() {
    firebase.initializeApp(this.firebaseConfig);
    this.Handler.connectUSER();
    this.Handler.checkInternetConnection();
    this.checkUpdateAlert();
    this.appPages = this.appPages_notCertified;
    this.http.get('https://asia-east2-login-session-a9776.cloudfunctions.net/isDaddy', {}).subscribe((data) => {
      this.isDaddy = data['isDaddy'];
    }, (err) => {
      console.log('error');
      console.log(err);
  }
    );
    firebase.auth().onAuthStateChanged((user) => {
      //console.log(user);
      if (user) {
        this.fcm.getToken().then(token => {
          //console.log(token);
          let users = firebase.database().ref('USERS');
          users.child(user.uid + '/Profile').update({
            Device: token,
          });
        });
        this.fcm.onTokenRefresh().subscribe(token => {
          console.log('refreshed token' + token);
          let users = firebase.database().ref('USERS');
          users.child(user.uid + '/Profile').update({
            Device: token,
          });
        });
        //Add last time app opened
        let users = firebase.database().ref('USERS/' + user.uid + '/Profile');
        const currTime = new Date()
        users.update({
          'Last Active': currTime.toString(),
        });
        users.on('value', (data) => {
          let profile = data.val();
          this.database_name = profile.Name;
          this.database_branch = profile.Branch;
          this.isCertified = profile.isCertified;
          if (user.email == this.isDaddy) {
            this.appPages = this.appPages_forDaddy;
          } else if (this.isCertified) {
            this.appPages = this.appPages_Certified;
          } else {
            this.appPages = this.appPages_notCertified;
 }
        });
      } else {
        console.log('not logged in');
        // User not logged in or has just logged out.
        this.database_name = 'User Not Logged in';
        this.database_branch = '';
        this.router.navigateByUrl('/login');
        this.menu.enable(false)
      }
    });

  }


  initializeApp() {
    this.platform.ready().then(() => {
      
      //this.statusBar.styleDefault();
      //this.statusBar.overlaysWebView(true)
      this.fcm.onNotification().subscribe( data => {
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          console.log("notification received type:- " + data.path)
          console.log('Received in background');
          this.Handler.dismissLoading();
          this.router.navigateByUrl(data.path);
          return
        }
        else {
          //Notification was received in foreground. Maybe the user needs to be notified.
          console.log("notification received type:- " + data.path)
          console.log('Received in foreground');
          this.Handler.dismissLoading()
          this.router.navigateByUrl(data.path);
          return
        }
      });
      this.statusBar.backgroundColorByHexString('#614385');
      this.splashScreen.hide();

    });

  }
}
