import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    standalone: false
})
export class NavComponent implements OnInit {
  public isValid: boolean = false;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    localStorage.getItem('token') != null ? this.isValid = true : this.isValid = false;
    this.apiService.$visible.subscribe(
      value => {
        this.isValid = value
      }
    )
  }

}
