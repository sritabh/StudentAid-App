import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Router, RouterModule } from '@angular/router';
import { HandlerService } from '../handler.service';
import { LoadingController,MenuController } from '@ionic/angular';
import { FormBuilder, Validators  } from '@angular/forms'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm = this.formBuilder.group({
    signup_email: ['', Validators.compose([Validators.required])],
    signup_password: ['',Validators.compose([Validators.required])],
    confirm_password: ['',Validators.compose([Validators.required])],
    profile_name: ['',Validators.compose([Validators.required])],
    profile_class: ['',Validators.compose([Validators.required])],
    profile_branch: ['',Validators.compose([Validators.required])]
  })
  signup_email: string;
  signup_password: string;
  confirm_password: string;
  profile_name: string;
  profile_class: string;
  profile_branch = 'Computer Science';
  constructor(
    private router: Router,
    public Handler: HandlerService, 
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private menu:MenuController
    ) { }
  async signupSubmit() {
    // console.log(this.profile_branch);
    if (this.signup_password == this.confirm_password) {
      var text = "SigningUp...."
      var time = 5000;
      this.Handler.presentLoading(text,time);
      firebase.auth().createUserWithEmailAndPassword(this.signup_email, this.signup_password).then(function(user) {

        console.log('signedUP' + user);
      })
     .catch(async (error) => {
       // Handle errors
       this.Handler.dismissLoading();
        const errtitle = 'Error';
        const errmsg = error.message;
        this.Handler.showAlert(errtitle, errmsg);
      console.log(error);
     }).then((user) => {
      const auth = firebase.auth().currentUser;
        if (auth) {
          const users = firebase.database().ref('USERS');
          users.child(auth.uid + '/Profile').set({
            Name: this.profile_name,
            Class: this.profile_class,
            Email: this.signup_email,
            Branch: this.profile_branch,
            DateJoined: new Date().toString(),
            isCertified: false,
      });
        }
     });
    }
    if (this.signup_password != this.confirm_password) {
      const errtitle = 'Error';
      const errmsg = 'Passwords are different';
      this.Handler.showAlert(errtitle, errmsg);
    }

    // console.log(this.email);
  }

  CheckAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        this.Handler.dismissLoading();
        user.updateProfile({
          displayName: this.profile_name,
        });
        this.router.navigateByUrl('/profile');
        console.log("signup says logged in user")
        console.log(user)
      } else {
        // user not logged in
        //this.loadingCtrl.dismiss()
        console.log('user needs to login signup says');
      }
    });

  }
  doRefresh(event) {
    console.log("refreshed")
    setTimeout(() => {
      this.ngOnInit()
      //console.log("chedck for ver " + this.currUser.emailVerified)
      event.target.complete();
    }, 2000);
  }
  ngOnInit() {
    this.CheckAuth();
    this.menu.enable(false)
    // this.router.navigateByUrl('/home');
  }

}
