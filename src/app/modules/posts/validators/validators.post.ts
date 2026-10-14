import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function maxValidator(maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) return null;
        if (!maxValue) return null;
  
        const currentValue = parseFloat(control.value?.toString().replace(/,/g, ''));
        if (!isNaN(maxValue) && !isNaN(currentValue) && currentValue > maxValue) {
            return { max: { max: maxValue, actual: currentValue } };
        }
  
        return null;
    };
}

export function minValidator(minValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) return null;
        if (!minValue) return null;
  
        const currentValue = parseFloat(control.value?.toString().replace(/,/g, ''));
        if (!isNaN(minValue) && !isNaN(currentValue) && currentValue < minValue) {
            return { min: { min: minValue, actual: currentValue } };
        }
  
        return null;
    };
}