import { Component, ViewChild } from '@angular/core';
import { NavController,AlertController, Item  } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  groups: Object[] =[];

  constructor(public db: AngularFireDatabase,public navCtrl: NavController,public alertCtrl: AlertController) {
    db.list<Item>('groups').valueChanges().subscribe(data=>{
      this.groups = data;
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
            console.log('Create clicked ',data);
            this.db.list('groups').push({
              name: data.title
            }).then(()=>{
              console.log("new Group");
            })
          }
        }
      ]
    });
    prompt.present();
  }

}
