import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,NgClass],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor() { }

  ngOnInit() 
  {
    // Add code to check if user i
  }

  red:boolean = false;
  blue:boolean = false;

toggleTheme() 
{
  // Add code to toggle theme
  this.red =!this.red;
}

}
