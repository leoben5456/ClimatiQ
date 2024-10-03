import { Component, OnInit } from '@angular/core';
import { gsap } from 'gsap';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Cloud animation
    gsap.to('#cloud', { duration: 2, x: 100, yoyo: true, repeat: -1 });

    // Rain animation
    gsap.to('#rain', {
      duration: 0.5,
      opacity: 1,
      y: 50,
      repeat: -1,
      delay: 0.5,
      ease: "power1.in"
    });
  }


}
