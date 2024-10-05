import { Component, OnInit, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, AfterViewInit {

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.animateCloud();
    this.animateRaindrops();
  }

  // Cloud floating animation
  animateCloud(): void {
    gsap.fromTo(
      '#cloud',
      { y: -10 },
      {
        y: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      }
    );
  }

  // Raindrops falling animation
  animateRaindrops(): void {
    gsap.to('.raindrop', {
      y: 150, // Drop distance
      opacity: 1,
      duration: 1.5,
      stagger: 0.2, 
      repeat: -1, 
      onRepeat: () => {
        gsap.set('.raindrop', { y: 0, opacity: 0 }); // Reset the raindrop position under the cloud
      }
    });
  }
}
  