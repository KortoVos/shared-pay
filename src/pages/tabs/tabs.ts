import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountPage } from '../account/account';
import { GroupPage } from '../group/group';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1: any;
  tab2: any;
  groupId:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.groupId = navParams.get("groupId");
    this.tab1 = AccountPage;
    this.tab2 = GroupPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
