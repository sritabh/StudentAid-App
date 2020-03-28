import { Component, OnInit,Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { HandlerService } from '../handler.service';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss'],
})

export class ProfileManagerComponent implements OnInit {
  @Input() userId;
  //
  profileName:string;
  profileClass:string;
  profileEmail:string;
  profileBranch:string;
  profileIsCertified:string;
  userJoinedOn:string;
  profileEmailVerified:boolean;
  lastActive:string="Last Active Not Available"

  constructor(
    private popCtrl:PopoverController,
    private Handler: HandlerService,
  ) { }
  update() {
    if (this.profileIsCertified == "true") {
      var isCertified = true;
    }
    else {
      var isCertified = false;
    }
    document.getElementById("updating").style.display = "block";
    document.getElementById("buttons").style.display = "none";
    let profile = firebase.database().ref('USERS/'+this.userId+"/Profile");
    profile.update({
      isCertified: isCertified,
    }).then((success)=>{
      //successs
      this.popCtrl.dismiss()
    }).catch((error)=> {
      console.log(error)
      var title = "Error"
      var msg = error.message;
      this.Handler.showAlert(title,msg);
      document.getElementById("buttons").style.display = "block";

    })
  }
  cancel() {
    this.popCtrl.dismiss()
  }
  test(){
    console.log(this.profileIsCertified + "active?")
  }
  ngOnInit() {
      
    console.log(this.profileIsCertified)
      let profile = firebase.database().ref('USERS/'+this.userId+"/Profile");
      profile.on('value',data =>{
        var profileData = data.val()
        //console.log(profileData)
        this.profileName = profileData.Name;
        this.profileBranch = profileData.Branch;
        this.profileClass = profileData.Class;
        this.profileEmail = profileData.Email;
        this.profileIsCertified = profileData.isCertified.toString();
        this.profileEmailVerified = profileData.EmailVerified;
        if (profileData['Last Active']) {
          this.lastActive = "Last Active: " + profileData['Last Active']
        }
        if (profileData['DateJoined']) {
          this.userJoinedOn = "Joined On: " +new Date(profileData['DateJoined']).toDateString();
        }
        else {
          this.userJoinedOn = "Joined On: First Release!"
        }
      })
    
  }

}
