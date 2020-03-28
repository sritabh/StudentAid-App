import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Router, RouterModule } from '@angular/router';
import { HandlerService } from '../handler.service';
import { AlertController,NavController,PopoverController,LoadingController,MenuController } from '@ionic/angular';
import { EditProfileComponent } from '../edit-profile/edit-profile.component'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  auth = firebase.auth().currentUser;
  data_name: string;
  data_branch: string;
  data_class: string;
  data_email: string;
  EmailVerified:boolean=true;
  currUser: any;
  currUserData: any;
  uid: string;
  isCertified = false;
  dataLoaded:boolean = false;



  constructor(
    private router: Router,
    public Handler: HandlerService,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private popCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private menu:MenuController
    ) {
     }
  LogOut() {
    firebase.auth().signOut().then(function() {
      console.log('loggetOut');
    }).catch(function(error) {
      console.log(error);
    });
    this.router.navigateByUrl('/login');
    }
  async editOptionPopover() {
    const popover = await this.popCtrl.create({
      component:EditProfileComponent,
      //event: ev,
      translucent: true,
      componentProps:{user:this.currUser,userData:this.currUserData},
      cssClass: 'editProfileOption'
    });
    return await popover.present();
  }
  editProfile() {
    this.editOptionPopover()
  }

  verifyEmail() {
    const tittle = 'Verify Email';
    const msg = 'Verification link sent to ' + this.currUser.email;
    this.currUser.sendEmailVerification().then(

      this.Handler.showAlert(tittle, msg));
  }
  doRefresh(event) {
    console.log("refreshed")
    setTimeout(() => {
      this.currUser.reload().then(()=>{
        this.ngOnInit()
      })
      //console.log("chedck for ver " + this.currUser.emailVerified)
      event.target.complete();
    }, 2000);
  }
  ionViewWillLeave() {
    console.log("left  profile")
    this.Handler.dismissLoading()
  }
  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        console.log(user.uid)
        console.log(user.emailVerified)
        if (!user.emailVerified) {
          this.menu.enable(false)
        }
        else if (user.emailVerified) {
          this.menu.enable(true)
        }
        this.currUser = user;
        this.uid = user.uid;
        //this.EmailVerified = user.emailVerified;
        const users = firebase.database().ref('USERS/' + user.uid + '/Profile');
        // this.userData = users;
        console.log('loggen in');

        this.currUserData = users;
        users.update({
          EmailVerified : user.emailVerified
        });
        users.on('value', (data) => {
          if (data) {
            this.Handler.dismissLoading();
            this.dataLoaded = true;
          }
          const profile = data.val();
          this.data_name = profile.Name;
          this.data_email = user.email;
          this.data_branch = profile.Branch;
          this.data_class = profile.Class;
          this.isCertified = profile.isCertified;
          this.EmailVerified = profile.EmailVerified;
        })
      }
      else {
        document.getElementById('profile').innerHTML = 'User Not LoggedIn!';
        this.router.navigateByUrl('/login');
        console.log('Login Required! profilesays');
      }
      //will read starting data as auth changed and then setting data values
      //dataLoaded will be set to true once the data is loaded
      if (!this.dataLoaded) {
        var text = "Loading Profile..."
        var time = 20000;
        this.Handler.presentLoading(text,time)
      }
    });
    
  }

}
