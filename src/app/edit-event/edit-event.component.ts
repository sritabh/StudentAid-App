import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { HandlerService } from '../handler.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {
  @Input() key;
  @Input() type;
  @Input() class;
  subject:string;
  event_detail:string;
  currentDate: any = new Date().toISOString();
  min_date: any = new Date().toISOString();
  userName: string = this.Handler.currUser.displayName;
  updateSuccess:boolean = false;
  constructor(
    private popCtrl:PopoverController,
    private Handler:HandlerService,
  ) { }
  cancel() {
    this.popCtrl.dismiss()
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
      var msg = "Update Timeout!!"
      if (!this.updateSuccess) {
        this.Handler.showAlert(title,msg)
      }
      }, 5000)
    if (this.key) {
      const Events = firebase.database().ref(this.class + '/Events/' +this.key);
      Events.update({
        'Edited': true,
        'Description' : this.event_detail,
        'Submission Date' : this.Handler.dateToNormal(this.currentDate),
        'Subject' : this.subject,
        'Edited by' : this.userName
      }).then(() => {
        this.updateSuccess = true;
        this.popCtrl.dismiss()
      })
    }
    
  }
  ngOnInit() {
    if (this.key) {
      const Events = firebase.database().ref(this.class + '/Events/' +this.key);
      Events.on('value', (data) => {
        const event = data.val();
        this.event_detail = event['Description'];
        if (this.type != "News") {
          this.currentDate = new Date(event['Submission Date']).toISOString();
          this.subject = event['Subject'];
        }
        else {
          this.subject = "NEWS";
          this.currentDate = "0"
        }
      });
    }
    }
    

}
