import { Component, OnInit,Input } from '@angular/core';
import { HandlerService } from '../handler.service';
import { PopoverController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @Input() email;
  constructor(
    private popCtrl:PopoverController,
    private Handler:HandlerService,
  ) { }
  reset() {
    document.getElementById("button").style.display = "none";
    document.getElementById("updating").style.display = "block";
    firebase.auth().sendPasswordResetEmail(this.email).then(() => {
      var title = "Password Reset"
      var msg = "Password reset link is send to " + this.email;
      this.Handler.showAlert(title,msg)
      this.popCtrl.dismiss()
    }).catch((error)=>{
      console.log(error)
      var title="Error";
      var msg = error.message;
      this.Handler.showAlert(title,msg)
      document.getElementById("button").style.display = "block";
      document.getElementById("updating").style.display = "none";

    })
  }
  cancel() {
    this.popCtrl.dismiss()
  }

  ngOnInit() {}

}
