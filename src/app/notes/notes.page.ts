import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { HandlerService } from '../handler.service';
import { Router, RouterModule } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  auth_uid: string;
  class: string;
  notes: any = [ ];
  notes_on_screen = 4;
  downloads: number;
  subject = 'ALL';
  dataLoaded:boolean = false;
  showOptionbutton:boolean=false;
  constructor(
    private router: Router,
    private Handler:HandlerService,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    ) { }
  getNotes(userClass) {
    var text = "Loading...."
      var time = 30000;
      if (!this.dataLoaded) {
        this.Handler.presentLoading(text,time);
      }
    const Notes = firebase.database().ref(userClass + '/Notes');
    Notes.on('value', (data) => {
      if (data) {
        this.Handler.dismissLoading();
        this.dataLoaded = true;
      }
      const note = data.val();
      this.notes = Object.entries(note) // note[0] for keys amd note[1] for values
      //console.log(this.notes)
    });
  }
  getFileURL(key, url) {
    document.getElementById('loading').style.display = 'block';
    const Notes = firebase.database().ref(this.class + '/Notes/'  + key);
    Notes.on('value', (data) => {
      const note = data.val();
      this.downloads = note.downloads + 1;
      console.log(this.downloads);
    });
    Notes.update({
      downloads : this.downloads,
    });
    const storageRef = firebase.storage().ref();
    const file = storageRef.child(url);
    file.getDownloadURL().then(function(downloadURL) {
      // this.generatedLink = downloadURL

      // FIX ME//Make the link to download
      window.open(downloadURL);

    }).then((success) => {
      // console.log(this.generatedLink) //Figure out hhow this is even working
      const Timeout = setTimeout( () => {
        document.getElementById('loading').style.display = 'none';
  }, 1000);
    }).catch((error)=>{
      document.getElementById('loading').style.display = 'none';
      var title = "Timeout Error!"
      var msg = "Can't fetch the file<br>File might be removed"
      this.Handler.showAlert(title,msg)
    });
  }
  checkFile(url) {
    if (url != 'Attach File') {
      return true;
    }

  }
  changeSubject() {
    console.log("sub changed");
    //this.notes_on_screen = this.notes.length
  }
//FIX-ME make infinite load work proprly and fix sorting
  loadElements(event) {
    if (this.notes_on_screen < this.notes.length) {
      setTimeout(() => {
        this.notes_on_screen = this.notes_on_screen + 3;
        this.getNotes(this.class);
        event.target.complete();
      }, 500);
    }
    else {
      event.target.complete();
    }
    
  }
  //more option button
  moreOption(event,key,url,subject) {
    var cls = this.class
    this.deleteOption(cls,key,url,subject)
  }
  async deleteOption(currClass,key,url, subject) {
    // deleteAlert box
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: '<b>Delete Notes for ' + subject + '?</b>',
      backdropDismiss: false,
      cssClass: 'DeletePop',
      buttons: [
        {
          text: 'Delete', // ok button
          handler: (blah) => {
            var loadText = "Deleting..."
            var time = 10000;
            this.Handler.presentLoading(loadText,time)
            const storageRef = firebase.storage().ref();
            const notesData = firebase.database().ref(currClass + '/Notes');
            storageRef.child(url).delete().then(()=>{
                notesData.child(key).remove().then(()=>{
                console.log("notes " + key + ' removed');
                this.Handler.dismissLoading()
                return
              }).catch((err)=>{
                var title = "Error!"
                var msg = "Error in deleting file<br>"+err
                this.Handler.showAlert(title,msg)
              })
            }).catch((err)=>{
              var title = "Error!"
              var msg = "Error in deleting file<br>"+err
              this.Handler.showAlert(title,msg)
            })
          },
          cssClass: 'DeleteButton'
        }, {
          text: 'Cancel', // cancel button
          role: 'cancel',
          cssClass: 'Cancel',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
  doRefresh(event) {
    console.log("refreshed")
    setTimeout(() => {
      //this.ngOnInit()
      this.getNotes(this.class);
      //console.log("chedck for ver " + this.currUser.emailVerified)
      event.target.complete();
    }, 2000);
  }
  changeClass() {
    this.dataLoaded = false;
    this.getNotes(this.class);
    //this.subject = "ALL";
  }
  ngOnInit() {
    //this.dataLoaded = false;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //console.log('Notes says logged in');
        this.auth_uid = user.uid;
        // User logged in already or has just logged in.
        const users = firebase.database().ref('USERS/' + user.uid + '/Profile');
        users.on('value', (data) => {
          if (data) {
            this.Handler.dismissLoading();
            this.dataLoaded = true;
          }
          const profile = data.val();
          this.class = profile.Class;
          this.showOptionbutton = profile.isCertified;
          this.getNotes(profile.Class);
        });
      } 
      else {
          console.log('Login Required! profilesays');
      }
    });
  }

}
