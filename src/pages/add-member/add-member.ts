import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import toonavatar from 'cartoon-avatar';

@IonicPage()
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {
  @ViewChild('email') email;
  @ViewChild('gender') gender;
  private groupDoc: AngularFirestoreDocument<Group>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private afs:AngularFirestore) {
    this.groupDoc = afs.doc<Group>('wallets/'+navParams.get("groupId"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMemberPage');
  }

  inviteUser(){
    this.groupDoc.ref.get().then(grp=>{
      console.log("try update")
      var memberList: User[] = grp.data().members;
      if(!memberList){ memberList=[] }
      var ava = toonavatar.generate_avatar({"gender":this.gender});
      console.log(ava);
      memberList.push({
        name:this.email.value,
        createDate:new Date().toLocaleString(),
        avatar:ava,
        money:0
      });
      
      this.groupDoc.update({members:memberList}).then(_ =>this.navCtrl.pop());
    });
  }

}
