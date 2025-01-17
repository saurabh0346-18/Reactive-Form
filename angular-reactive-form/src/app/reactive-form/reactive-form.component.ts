import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css'],
  standalone: false,
})
export class ReactiveFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required, this.phoneValidator]],
        role: ['', [Validators.required]],
        address: this.fb.group({
          street: ['', [Validators.required]],
          city: ['', [Validators.required]],
          state: ['', [Validators.required]],
          zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
        }),
        skills: this.fb.array([]), // Existing FormArray for Skills
        projects: this.fb.array([]), // New FormArray for Projects
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Getters for FormArray
  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  get projects(): FormArray {
    return this.form.get('projects') as FormArray;
  }

  // Add a new skill to the FormArray
  addSkill() {
    this.skills.push(
      this.fb.group({
        skillName: ['', [Validators.required]],
        experience: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      })
    );
  }

  // Remove a skill from the FormArray
  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  // Add a new project to the FormArray
  addProject() {
    this.projects.push(
      this.fb.group({
        projectName: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        duration: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      })
    );
  }

  // Remove a project from the FormArray
  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  // Custom Validator for Phone Number
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^[0-9]{10}$/;
    if (control.value && !phoneRegex.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  }

  // Custom Validator to Match Password and Confirm Password
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Error Message Helper
  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength}`;
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    if (control?.hasError('invalidPhone')) {
      return 'Phone number must be 10 digits';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid format';
    }
    return '';
  }

  // Error for Group Validators
  getGroupError(): string {
    const group = this.form;
    if (group.hasError('passwordsMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    } else {
      console.log('Form Invalid');
    }
  }
}
