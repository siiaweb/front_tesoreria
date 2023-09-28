import { Component, OnInit } from '@angular/core';
import { BannersService } from '../../services/dashboard/banners/banners.service';
import { Tbanners } from '../../services/dashboard/banners/tbanners';
import { Subscription } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  private subscription: Subscription;
  tbanners: Tbanners[];

  constructor( private _bs: BannersService, public router: Router ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.subscription = this._bs.getBanners().subscribe(
      (tbanners) => {
        this.tbanners = tbanners;
        //console.log(this.tbanners);
      }
    )
  }

}
