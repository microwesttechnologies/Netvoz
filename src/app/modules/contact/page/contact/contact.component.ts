import { Component, VERSION, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {  HostListener } from '@angular/core';
import AOS from 'aos';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

contactForm: FormGroup;
disabledSubmitButton: boolean = true;
optionsSelect: Array<any>;
asuntoControl = new FormControl('01');

@HostListener('input') oninput() {

  if (this.contactForm.valid) {
    this.disabledSubmitButton = false;
    }
  }


  constructor(private fb: FormBuilder) { 
    this.contactForm = this.fb.group({
      'contactFormName': ['', Validators.required],
      'contactFormEmail': ['', Validators.compose([Validators.required, Validators.email])],
      'contactFormSubjects': ['', Validators.required],
      'contactFormMessage': ['', Validators.required],
      'contactFormCopy': [''],
      });
  }

  
  ngOnInit(): void {
    AOS.Init();
  }

  onSubmit() {
  }


}
