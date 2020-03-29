import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import { Router, RouterModule } from '@angular/router';
import { HandlerService } from '../handler.service';
import { LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.page.html',
  styleUrls: ['./add-events.page.scss'],
})
export class AddEventsPage implements OnInit {
auth = firebase.auth().currentUser;
months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
currentDate: any = new Date().toISOString();
min_date: any = new Date().toISOString();
submission_date_gmt: any;
now: any = new Date();
added_time: string = (this.now.getHours()) + ':' + (this.now.getMinutes());
added_date: string = this.now.getDate() + ' ' + this.months[this.now.getMonth()] + ',' + this.now.getFullYear();
testDate: string;
event_detail: string='';
files: any;
FileName = 'Attach File';
newFileName: string;
editName: string; // removing the extension
extension: string;
subject: string;
data_type = 'Assignment';
notes_title: string;
percentUploaded:any;
eventSubmitDisbled:boolean = false;
fileUploaded:boolean;
userClass:string;
  constructor(private router: Router,
    private Handler: HandlerService,
    private loadingCtrl:LoadingController,
    ) { }
  submitDataForm() {
    if (this.FileName != 'Attach File') {
      //document.getElementById('uploading').style.display = 'block';
      var text = "Uploading File..."
      var time = 6000000; //not dropping the uploading screen wih timer hoping file can be big enough and net can be slow
      this.Handler.presentLoading(text,time)
      this.UploadFile();
      console.log(this.fileUploaded)
    }
    else {
      this.submitData()
    }
  }
  submitData() {
    document.getElementById('uploading').style.display = 'block'; // loading or processing
    document.getElementById('submitButton').style.display = 'none';
      const Timeout = setTimeout( () => {
        document.getElementById('uploading').style.display = 'none';
        document.getElementById('submitButton').style.display = "inline-block";
      }, 5000);

    if (this.auth != null) {
      const users = firebase.database().ref('USERS/' + this.auth.uid + '/Profile');
      if (this.data_type == 'Assignment') {
        users.once('value', (data) => {
          const profile = data.val();
          // creating events with different datatypes(news and assignmeny)
          const events = firebase.database().ref(profile.Class + '/Events');
          events.push({
            Subject: this.subject,
            'Submission Date': this.Handler.dateToNormal(this.currentDate),
            Description: this.event_detail,
            'Added on': this.added_time + ' ' + this.added_date,
            DoneBy: 0,
            'Submitted By': profile.Name,
            DataType: this.data_type,
            fileURL: this.FileName,
          }).then((success) => {
            console.log(this.FileName);
              document.getElementById('uploading').innerHTML = '<ion-icon style=\'color: green;\' name=\'checkmark-circle\'></ion-icon>Submitted';
              const Timeout = setTimeout( () => {
                document.getElementById('uploading').style.display = 'none';
                document.getElementById('uploading').innerHTML = '<ion-spinner name=\'dots\'></ion-spinner>';
                this.router.navigateByUrl('/view-events')
                }, 1000);
          }).catch((error)=>{
            console.log(error + "\n while submitting event")
            document.getElementById('uploading').style.display = 'none';
            var title = "TimeOut!";
            var msg = "Posting" +this.data_type + " failed <br>You might try Restarting the App";
            this.Handler.showAlert(title,msg);
          });
        });
      } 
      else if (this.data_type == 'Notes') {
        users.once('value', (data) => {
          const profile = data.val();
          const events = firebase.database().ref(profile.Class + '/' + this.data_type);
          events.push({
            Title: this.notes_title,
            'Added on': this.added_time + ' ' + this.added_date,
            'Submitted By': profile.Name,
            DataType: this.data_type,
            fileURL: this.FileName,
            subject: this.subject,
            downloads: 0,
          }).then((success) => {
            console.log(this.FileName);
            document.getElementById('uploading').innerHTML = '<ion-icon style=\'color: green;\' name=\'checkmark-circle\'></ion-icon>Submitted';
            const Timeout = setTimeout( () => {
              document.getElementById('uploading').style.display = 'none';
              document.getElementById('uploading').innerHTML = '<ion-spinner name=\'dots\'></ion-spinner>';
              this.router.navigateByUrl('/notes')
              }, 1000);
          }).catch((error)=>{
            console.log(error + "\n while submitting event")
            document.getElementById('uploading').style.display = 'none';
            var title = "TimeOut!";
            var msg = "Posting" +this.data_type + " failed <br>You might try Restarting the App";
            this.Handler.showAlert(title,msg);
          });
        });
      }
      else if (this.data_type == 'News') {
          users.once('value', (data) => {
            const profile = data.val();
            const events = firebase.database().ref(profile.Class + '/Events');
            events.push({
              Subject: 'NEWS',
              Description: this.event_detail,
              'Added on': this.added_time + ' ' + this.added_date,
              'Submitted By': profile.Name,
              'Submission Date': 0,
              DoneBy: 0,
              DataType: this.data_type,
              fileURL: this.FileName,
            }).then((success) => {
              console.log(this.FileName + 'Added');
                document.getElementById('uploading').innerHTML = '<ion-icon style=\'color: green;\' name=\'checkmark-circle\'></ion-icon>Submitted';
                const Timeout = setTimeout( () => {
                  document.getElementById('uploading').style.display = 'none';
                  document.getElementById('uploading').innerHTML = '<ion-spinner name=\'dots\'></ion-spinner>';
                  this.router.navigateByUrl('/view-events')
                  }, 1000);
            });
          });
        }


    } else {
      console.log('Login First');
    }
  }
  fileSelected($file) {
    this.files = $file.target.files[0]; // Fix ME//make it to upload multiple files
    // console.log($file.target.files)
    this.FileName = this.files.name;
    const nameFull = this.FileName;
    const nameNum = nameFull.lastIndexOf('.');
    const name = nameFull.substring(0, nameNum);
    this.extension = nameFull.substring(nameNum, nameFull.length);
    console.log('extenion' + this.extension + '\n' + name);
    this.editName = name;
    document.getElementById('newFileName').style.display = 'block';
    this.eventFormisValid()
  }
  changeName($newName) {

    this.FileName = this.newFileName + this.extension;

    console.log(this.FileName);
  }
  UploadFile() {
    document.getElementById('uploading').style.display = 'block';
    const storageRef = firebase.storage().ref();
    const file = storageRef.child(this.FileName);
    const fileUpload = file.put(this.files);
    //this.Handler.presentUploading(fileUpload);
    fileUpload.on('state_changed',(snapshot) => {
      this.percentUploaded = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) + "% Uploaded"
      if (Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100) >= 100) {
        this.Handler.dismissLoading();
        this.submitData()
      }
    });


  }
 openFile() {
   document.getElementById('fileselector').click();
   console.log('open file');
 }
 ///Form Validator
 eventFormisValid() {
   if (this.data_type == "News") {
    if (this.event_detail == '') {
      this.eventSubmitDisbled = true;
    }
    else {
      this.eventSubmitDisbled = false;
    }
   }
   else if (this.data_type == "Assignment") {
    if (this.event_detail == '' || this.subject == undefined) {
      this.eventSubmitDisbled = true;
    }
    else {
      this.eventSubmitDisbled = false;
    }
   }
   else if (this.data_type == "Notes") {
    if (this.notes_title == '' || this.subject == undefined || this.FileName == 'Attach File') {
      this.eventSubmitDisbled = true;
    }
    else {
      this.eventSubmitDisbled = false;
    }
   }
 }
 dateTest() {
   console.log(this.currentDate)
   var nd = this.Handler.dateToNormal(this.currentDate)
   console.log("normal date"+ nd)

   var x = new Date(nd)
   console.log("gmttime to 00:00 " + x)
   //var y = new Date(x)
   //console.log(y)
   //console.log(new Date().toISOString())
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
    this.eventFormisValid()
  }

}
