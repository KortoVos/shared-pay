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
  walletMembersCollection: AngularFirestoreCollection<User>;
  walletUsers: Observable<User[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore,public afAuth: AngularFireAuth) {
    this.groupId = navParams.get("groupId");
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.walletMembersCollection = afs.collection<Group>('wallets').doc(this.groupId).collection('wallet_members');
        this.walletUsers = this.walletMembersCollection.snapshotChanges().map(actions => {
          return actions.map(a=>{
            return {
              name:a.payload.doc.data().name,
              avatar:a.payload.doc.data().avatar,
              createDate:a.payload.doc.data().createDate,
              money:a.payload.doc.data().money
            }
          })
        })
      } else {
        console.log('user not logged in');
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPage');
  }

  addMember(){
    this.navCtrl.push(AddMemberPage,{
      groupId:this.groupId
    });
  }

}
