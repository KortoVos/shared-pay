import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from 'angularfire2/firestore'
import {Observable}from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { AddMemberPage } from '../add-member/add-member';

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
  groupId:string;
  groupsCollection: AngularFirestoreCollection<Group>;
  group: Observable<Group>;
  private groupDoc: AngularFirestoreDocument<Group>;
  memberList: User;


  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,public afAuth: AngularFireAuth) {
    this.groupId = navParams.get("groupId");
    console.log("groupID",this.groupId);
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.groupDoc = afs.doc<Group>('wallets/'+navParams.get("groupId"));
        this.group = this.groupDoc.valueChanges();
        console.log("test32")
        this.group.map(res=>console.log(res))
      } else {
        console.log('user not logged in');
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPage');
    console.log(this.group);
  }

  addMember(){
    this.navCtrl.push(AddMemberPage,{
      groupId:this.groupId
    });
  }

}
