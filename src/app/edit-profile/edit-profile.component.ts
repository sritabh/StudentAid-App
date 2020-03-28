import { Component, OnInit,Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { HandlerService } from '../handler.service'
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @Input() user
  @Input() userData
  userName:string;
  userBranch:string;
  userClass:string;
  userEmail:string;
  isCertified:boolean;
  userid:string;
  updateSuccess:boolean = false;
  constructor(
    private popCtrl: PopoverController,
    public Handler: HandlerService,
  ) { }

  emailChangeWarning() {
    var title = "Warning!"
    var msg = "Changing email requires re-verification of New Email!"
    this.Handler.showAlert(title,msg);
    
  }
  save() {
    document.getElementById("button").style.display = "none";
    document.getElementById("updating").style.display = "block";
    const Timeout = setTimeout(() => {
      if (document.getElementById("button") && document.getElementById("updating")) {
        document.getElementById("button").style.display = "block";
        document.getElementById("updating").style.display = "none";
      }
      var title = "Error";
      var msg = "Update Timeout!!\nTry Again"
      if (!this.updateSuccess) {
        this.Handler.showAlert(title,msg)
      }
      }, 5000)
    this.user.updateProfile({
      displayName: this.userName,
    });
    this.userData.update({
      Name : this.userName,
      Class : this.userClass,
      Branch : this.userBranch,
      EmailVerified : this.user.emailVerified,
    }).then('value', (error) => {
      if (error) {
        const title = 'Error';
        const msg = error.message;
        this.Handler.showAlert(title, msg);
      }
    }).then(() => {
      this.updateSuccess = true;
      this.popCtrl.dismiss()
    })
    this.user.updateEmail(this.userEmail).then(() => {
      this.updateSuccess = true;
        this.userData.update({
          EmailVerified : this.user.emailVerified,
          Email : this.user.email,
        })
        
        //window.location.reload();
      if (this.userEmail != this.user.email) {
        
      }
    }).then('value', (error) => {
      if (error) {
      console.log('erorr' + error);
      const title = 'Error';
      const msg = error.message;
      this.Handler.showAlert(title, msg);
      }

  })
  }
  cancel() {
    this.popCtrl.dismiss();
  }
  ngOnInit() {
    this.userName = this.user.displayName;
    this.userid = this.user.uid;
    console.log(this.user.displayName);
    console.log(this.user)
    this.userData.once('value', (data) => {
      const profile = data.val();
      this.userEmail = this.user.email;
      this.userBranch = profile.Branch;
      this.userClass = profile.Class;
      this.isCertified = profile.isCertified;
    });
  }

}
