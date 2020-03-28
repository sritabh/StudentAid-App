import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { HandlerService } from './handler.service';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CloudFunctionProvider } from './cloud-function-service.service';
import { HTTP } from '@ionic-native/http/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { MoreOptionComponent } from './more-option/more-option.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { FormsModule,FormBuilder } from '@angular/forms';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileManagerComponent } from './profile-manager/profile-manager.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SendUpdateComponent } from './send-update/send-update.component';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { OrderByPipe } from './order-by.pipe';
import { Network } from '@ionic-native/network/ngx';
import { PowerManagement } from '@ionic-native/power-management/ngx';

@NgModule({
  declarations: [AppComponent,
    MoreOptionComponent,
    EditEventComponent,
    EditProfileComponent,
    ProfileManagerComponent,
    ForgotPasswordComponent,
    SendUpdateComponent
    
  ],
  entryComponents: [
    MoreOptionComponent,
    EditEventComponent,
    EditProfileComponent,
    ForgotPasswordComponent,
    ProfileManagerComponent,
    SendUpdateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, HandlerService, HttpClient, CloudFunctionProvider, HTTP, FCM,
    BackgroundMode,
    LocalNotifications,
    Network,
    PowerManagement,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
