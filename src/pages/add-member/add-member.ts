import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import toonavatar from 'cartoon-avatar';

@IonicPage()
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {
  @ViewChild('name') name;
  @ViewChild('email') email;
  @ViewChild('gender') gender;
  memberCollection: AngularFirestoreCollection<User>;
  private groupDoc: AngularFirestoreDocument<Group>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.groupDoc = afs.doc<Group>('wallets/'+navParams.get("groupId"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMemberPage');
  }

  inviteUser(){
    this.groupDoc.ref.get().then(grp=>{
      var ava = toonavatar.generate_avatar({"gender":this.gender});
      var usr:User = {
        name:this.name.value,
        email:this.email.value,
        createDate:new Date().toLocaleString(),
        avatar:ava,
        money:0
      }
      this.afs.doc('user/'+usr.email).ref.get().then(uDoc=>{
        if(uDoc.exists){
          var userList = uDoc.data().groups_refs;
          if(!userList){ userList=[] }
          userList.push(grp.id);
          this.afs.collection('user').doc(usr.email).update({groups_refs:userList});
        }
      });
      var memberRefs = grp.data().members_refs;
      memberRefs.push(usr.email);
      this.groupDoc.update({members_refs:memberRefs});
      this.groupDoc.collection('wallet_members').doc(usr.email).set(usr).then(_ =>this.navCtrl.pop());
      
    });
  }

}
