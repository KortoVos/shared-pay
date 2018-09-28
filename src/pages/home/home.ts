import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs'
import 'rxjs/add/operator/map';
import toonavatar from 'cartoon-avatar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  groupsCollection: AngularFirestoreCollection<Group>;
  groups: Observable<Group[]>;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.groupsCollection = afs.collection<Group>('wallets', ref => ref.where('members_refs', 'array-contains', res.uid));
        this.groups = this.groupsCollection.snapshotChanges().map(actions => {
          return actions.map(a => {
            return {
              id: a.payload.doc.id,
              name: a.payload.doc.data().name,
              admins_refs: a.payload.doc.data().admins_refs,
              members_refs: a.payload.doc.data().members_refs,
            }
          })
        })
      } else {
        console.log('user not logged in');
      }
    });
  }

  newGroup() {
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
                  name: data.title,
                  admins_refs:[res.uid],
                  members_refs:[res.uid]
                }
                this.groupsCollection.add(newGroup).then(grp=>{
                  this.afs.doc('user/'+res.uid).ref.get().then(uDoc=>{
                    var userList = uDoc.data().groups_refs;
                    if(!userList){ userList=[] }
                    userList.push(grp.id);
                    this.afs.collection('user').doc(res.uid).update({groups_refs:userList});
                  });
                  var ava = toonavatar.generate_avatar();
                  var usr:User = {
                    name:res.email,
                    createDate:new Date().toLocaleString(),
                    avatar:ava,
                    money:0
                  }
                  this.afs.doc('wallets/'+grp.id).collection('wallet_members').doc(new Date().getTime().toString()).set(usr);
                });

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
    this.navCtrl.push(TabsPage, {
      groupId: groupId
    });
  }


}
