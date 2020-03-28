import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ViewEventsPage } from '../view-events/view-events.page'
import { EditEventComponent } from '../edit-event/edit-event.component'
import { HandlerService } from '../handler.service';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-more-option',
  templateUrl: './more-option.component.html',
  styleUrls: ['./more-option.component.scss'],
})
export class MoreOptionComponent implements OnInit {
  @Input() key;
  @Input() type;
  @Input() class
    constructor(
    private popOverCtrl:PopoverController,
    private viewEventPage: ViewEventsPage,
    private Handler: HandlerService,
  ) { }
  editEvent() {
    console.log("hello")
    console.log("moreOtio got" + this.key)
    var currClass = this.class;
    var key = this.key;
    var type = this.type;
    this.popOverCtrl.dismiss().then(() => {
      this.editEventPopOver(currClass,key,type)
    })
    
  }
  deleteEvent() {
    var key = this.key;
    var type = this.type;
    var currclass = this.class
    this.popOverCtrl.dismiss().then(() => {
      if (key && type) {
        this.viewEventPage.deleteOption(currclass,key,type)
      }
      else
        console.log("No key and type available")
    })
    
  }
  async editEventPopOver(currClass,key,type) {
    const popover = await this.popOverCtrl.create({
      component:EditEventComponent,
      //event: ev,
      translucent: true,
      componentProps:{key:key, type: type,class: currClass},
      cssClass: 'event-content'
    });
    return await popover.present();
  }
  ngOnInit() {
    if (this.key) {
      var user = this.Handler.currUser
        console.log("key is avaliable"+ this.key + user.displayName)
        
    }
    else
      console.log("no key available")
  }

}
