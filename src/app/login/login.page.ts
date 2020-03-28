import { Component, OnInit } from '@angular/core';
import { LoadingController,MenuController,PopoverController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Router, RouterModule } from '@angular/router';
import { HandlerService } from '../handler.service';
import { FormBuilder, Validators  } from '@angular/forms'
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public errorMessage = {
    email : [
      {
      type : 'required',
      message : 'Email is Required'
        }
    ],
    password : [
      {
      type : 'required',
      message : 'Password is Required'
        }
    ]
  }
  loginForm = this.formBuilder.group({
    email: ['', Validators.compose([Validators.required])],
    password: ['',Validators.compose([Validators.required])],
  })
  email: string;
  password: string;
  userID: any;
  passwordType:string="password";
  passwordIcon:string="eye-off"
  constructor(private router: Router, 
    public Handler: HandlerService,
    private loadingCtrl:LoadingController,
    private formBuilder:FormBuilder,
    private menu:MenuController,
    private popCtrl:PopoverController,
    ) { }
  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  submitLogin() {
    var text = "Authenticating...."
    var time = 10000;
    this.Handler.presentLoading(text,time)
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function(user) {
      console.log('Loggedin' + user);
    })
   .catch((error) => {
     // Handle errors
     this.loadingCtrl.dismiss();
     console.log(error.message);
     var title="Error";
     var msg = error.message;
     this.Handler.showAlert(title,msg)
   });
  }
  forgotPassword() {
    this.forgotPasswordPopOver()
  }
  async forgotPasswordPopOver() {
    const popover = await this.popCtrl.create({
      component:ForgotPasswordComponent,
      //event: ev,
      translucent: true,
      componentProps:{email:this.email},
      cssClass: 'forgotPasswordPop'
    });
    return await popover.present();
  }
  logout() {
    firebase.auth().signOut().then(function() {
      console.log('loggetOut');
    }).catch(function(error) {
      console.log(error);
    });
    }
    CheckAuth() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User logged in already or has just logged in.
          this.loadingCtrl.dismiss();
          this.router.navigateByUrl('/profile');
        } else {
          // user not logged in
          console.log('Login Required');
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
    this.menu.enable(false)
    this.CheckAuth();

  }

}
