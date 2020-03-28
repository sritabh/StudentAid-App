import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { HandlerService } from '../handler.service';

@Component({
  selector: 'app-send-update',
  templateUrl: './send-update.component.html',
  styleUrls: ['./send-update.component.scss'],
})
export class SendUpdateComponent implements OnInit {
  UpdateVersion:number;
  UpdateURL:string;
  UpdateTitle:string;
  UpdateMessage:string;

  constructor(
    private popCtrl:PopoverController,
    private Handler: HandlerService,
  ) { }

  send() {
    document.getElementById("updating").style.display = "block";
    document.getElementById("buttons").style.display = "none";
    let newUpdate = firebase.database().ref('UPDATE');
    newUpdate.update({
      message: this.UpdateMessage,
      link: this.UpdateURL,
      version: this.UpdateVersion,
      Title: this.UpdateTitle,
    }).then((success) =>{
      this.popCtrl.dismiss()
    }).catch((error)=>{
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

  ngOnInit() {
    let update = firebase.database().ref('UPDATE');
      update.once('value',data =>{
        var updateData = data.val()
        this.UpdateMessage = updateData.message;
        this.UpdateURL = updateData.link;
        this.UpdateTitle = updateData.Title;
        this.UpdateVersion = updateData.version;

      })
  }

}
