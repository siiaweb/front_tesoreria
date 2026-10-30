import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchWithField(originalFieldKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      
      if (!formGroup) return null;
  
      const originalControl = formGroup.get(originalFieldKey);
  
      if (!originalControl) {
        return null;
      }

      if (originalControl.value !== control.value) {
        return { fieldsDoNotMatch: {field: originalControl.value}};
      }
  
      return null;
    };
}

export function fieldIdValidation(otherField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    if(control.value == null || control.value === '') {
      return null;
    }

    const otherControl = control.parent.get(otherField)?.value;
    return (otherControl == null || otherControl == '') 
    ? {noId: true}
    : null;
  }
}