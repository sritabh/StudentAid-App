import { Component, OnInit,Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { AlertController,PopoverController, LoadingController } from '@ionic/angular';
import { HandlerService } from '../handler.service';
import { MoreOptionComponent } from '../more-option/more-option.component';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.page.html',
  styleUrls: ['./view-events.page.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class ViewEventsPage implements OnInit {
  ago: any;

  constructor(
    private alertCtrl: AlertController, 
    public Handler: HandlerService,
    private popOverCtrl:PopoverController,
    private loadingCtrl: LoadingController,
    ) { }
  current_user = firebase.auth().currentUser;
  auth_uid: string;
  subject: string;
  submitted_by: string;
  detail: string;
  submission_date: string;
  added_on: string;
  class: string;
  assignmentDone: boolean;
  database_assignmentDone: boolean;
  assignment_doneBy: number;
  events_on_screen = 4;
  submittedTime: any; // time difference betwween posted and current
  events: any = [ ];
  generatedLink: string;
  data_type = 'Assignment/News';
  showOptionbutton: boolean = false;
  dataLoaded:boolean = false;
  getAssignments() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.auth_uid = user.uid;

        const users = firebase.database().ref('USERS/' + user.uid + '/Profile');
        const users_assignment = firebase.database().ref('USERS/' + user.uid + '/Assignments');

        users_assignment.on('value', (data) => {
          this.database_assignmentDone = data.val();
          if (this.database_assignmentDone == null) {
            firebase.database().ref('USERS/' + user.uid + '/Assignments/assignmentPath').set(true);
          }
        });
        users.on('value', (data) => {
          const profile = data.val();
          this.class = profile.Class;
          this.showOptionbutton = profile.isCertified;
          const Events = firebase.database().ref(profile.Class + '/Events');
          Events.on('value', (data) => {
            if (data) {
              this.Handler.dismissLoading();
              this.dataLoaded = true;
            }
            const event = data.val();
            this.events = Object.entries(event); // events[0] for keys amd events[1] for values
            // console.log(this.assignments)
          });
        });
      } 
      else {
          console.log('Login Required! eventview says');
          // this.router.navigateByUrl('/login');
      }
      var text = "Loading...."
      var time = 10000;
      if (!this.dataLoaded) {
        this.Handler.presentLoading(text,time);
      }
    });
  }
  eventViewed(key, type) {
    console.log('event done' + key);
  }
  //done assignment button
  doneAssignment(keys, doneBy) {
    var time=5000;
    var title="Processing..."
    this.Handler.presentLoading(title,time);
    if (this.database_assignmentDone != null) {
      if (this.database_assignmentDone[keys] != undefined) {
        if (this.database_assignmentDone[keys].assignmentDone == true) {
          this.assignmentDone = true;
        } else {
        this.assignmentDone = false;
        }
      } else {
        this.assignmentDone = false;
      }
  }
    // check login session if no
    if (this.assignmentDone == false) {
      this.assignment_doneBy = doneBy + 1;
      this.assignmentDone = true;

    } else if (this.assignmentDone == true) {
      this.assignment_doneBy = doneBy - 1;
      this.assignmentDone = false;
    }
    const Assignments = firebase.database().ref(this.class + '/Events');
    Assignments.child(keys).update({
        DoneBy : this.assignment_doneBy,
      });
    this.setAssignmentDone(keys);

  }
  // setting done for user so that it won't vanih after refresh
  setAssignmentDone(keys) {
    const users_assignment = firebase.database().ref('USERS/' + this.auth_uid + '/Assignments');
    users_assignment.child(keys).update({
      assignmentDone : this.assignmentDone,
    }).then(()=>{
      this.Handler.dismissLoading();
    })
  }
  // using database to check where assignment completed or not
  checkIfDoneAssignment(keys) {
    if (this.database_assignmentDone != null) {
      if (this.database_assignmentDone[keys] != undefined) {
        if (this.database_assignmentDone[keys].assignmentDone) {
          return true;
        } else {

          return false;
        }
      } else {
        return false;
      }
  }
  }
  ///FIX-ME make infinite load work proprly and fix sorting
  loadAssignment(event) {
    setTimeout(() => {
      console.log('Done');
      this.events_on_screen = this.events_on_screen + 3;
      event.target.complete();
    }, 500);
    // console.log(event)

  }
  // Side three button function to edit and delete
  moreOption(event,key, type) {
    this.moreOptionPopover(event,key,type)
  }
  async moreOptionPopover(ev: any,key,type) {
    const popover = await this.popOverCtrl.create({
      component:MoreOptionComponent,
      event: ev,
      translucent: true,
      componentProps:{key:key, type: type,class: this.class},
      cssClass: 'moreOption'
    });
    return await popover.present();
  }
  async deleteOption(currclass ,key, type) {
    // deleteAlert box
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: '<b>Delete this ' + type + '?</b>',
      backdropDismiss: false,
      cssClass: 'DeletePop',
      buttons: [
        {
          text: 'Delete', // ok button
          handler: (blah) => {
            console.log(currclass)
            const events = firebase.database().ref(currclass + '/Events');
            events.child(key).remove();
            console.log(key + 'removed');
          },
          cssClass: 'DeleteButton'
        }, {
          text: 'Cancel', // cancel button
          role: 'cancel',
          cssClass: 'Cancel',
          handler: () => {
            console.log(currclass)
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

checkFile(key, url) {
  if (url != 'Attach File') {
    return true;
  }

}
// FIX-ME//
// Getting link directly by filename(not a good idea in case of similar filename)
getFileURL(key, url) {
  document.getElementById('loading').style.display = 'block';
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

  getTimesAgo(date) {
     this.ago = this.Handler.timeAgo(date)
    return true;
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
    //this.Handler.connectUSER(); // Warning: page shouldnot start from here else it wont work wont chck if user is ertified
    this.getAssignments();

    }


}
