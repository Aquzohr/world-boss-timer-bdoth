import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs';
import { DELEGATE_CTOR } from '@angular/core/src/reflection/reflection_capabilities';

@Component({
  selector: 'boss-list',
  templateUrl: './boss-list.component.html',
  styleUrls: ['./boss-list.component.css']
})

export class BossListComponent implements OnInit {

  constructor(private db: AngularFireDatabase) { }

  hour = new Date().getHours();
  min = new Date().getMinutes();
  sec = new Date().getSeconds();

  day = new Date().getDay();
  nextDay = this.setNextday(this.day+1);

  bossList = [];
  isLoading = true;

  Loading(){
    this.isLoading = false;
  }

  setNextday(day){
    if(day==7){
      day=0
    }
    return day;
  }

  leftTimeToday(boss_time){
    var time = boss_time*60*60;
    var current_time = (this.hour*60*60)+(this.min*60)+this.sec;

    return time - current_time;
  }

  leftTimeNextday(boss_time){
    var time = boss_time*60*60 + (24*60*60);
    var current_time = (this.hour*60*60)+(this.min*60)+this.sec;
    return time - current_time;
  }

  createJSON(){
    let k=0;
    let boss=["Kzarka", "Kutum"];

    var metadata = [];

    for(let i=1; i<8; i++){

      metadata.push(
        {
            "day": i,
            "time": "18:00",
            "name": boss[(i)%2]
        },
      );
    }

    return metadata;

  }

  ngOnInit() {
    this.getBoss('/world_boss').subscribe(
      (response) => {
        this.bossList = response
        this.isLoading = response.some(x => x.time == 0) ? false : true;
      }
    );

  }

  getBoss(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }

}
