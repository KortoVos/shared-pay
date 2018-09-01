import { Component, ViewChild } from '@angular/core';
import { NavController,AlertController, Item } from 'ionic-angular';
import {AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument} from 'angularfire2/firestore'
import {Observable}from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import {GroupPage} from '../group/group'

interface Group{
  id?:string;
  name: string;
  admin: string;
  member?: string[];
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  groupsCollection: AngularFirestoreCollection<Group>;
  groups: Observable<Group[]>;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController,private afs:AngularFirestore,public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.groupsCollection = this.afs.collection<Group>('wallets', ref => ref.where('admin', '==',res.uid ));
        this.groups = this.groupsCollection.snapshotChanges().map(actions=>{
          return actions.map(a=>{
            return{
              id:a.payload.doc.id,
              name:a.payload.doc.data().name,
              admin:a.payload.doc.data().admin,
            }
          })
        })
      } else {
        console.log('user not logged in');
      }
    });
  }

  newGroup(){
    const prompt = this.alertCtrl.create({
      title: 'Group Name',
      message: "Enter a name for this new Groupwallet",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Create',
          handler: data => {
            this.afAuth.authState.subscribe(res => {
              if (res && res.uid) {
                const newGroup: Group = {
                  name:data.title,
                  admin:res.uid
                } 
                this.groupsCollection.add(newGroup);
              } else {
                console.log('user not logged in');
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showGroup(groupId: string) {
    this.navCtrl.push(GroupPage,{
      groupId:groupId
    });
  }


}
