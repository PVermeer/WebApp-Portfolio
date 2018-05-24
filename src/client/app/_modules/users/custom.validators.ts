import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

// Copy from https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}
interface PatternValidatorOptions {
  minLength?: number;
  maxLength?: number;
  requireLetters?: boolean;
  requireLowerCaseLetters?: boolean;
  requireUpperCaseLetters?: boolean;
  requireNumbers?: boolean;
  requireSpecialCharacters?: boolean;
  noSpecialCharacters?: boolean;
}

export class AppValidators {

  /**
   * Validator that requires controls to not match a username in the database.
   * @param userService The userservice where the checkUsername method exists.
   */
  static usernameAsync(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (isEmptyInputValue(control.value)) {
        return null;  // Don't validate empty values to allow optional controls
      }
      return timer(500).pipe(switchMap(() => { // Debounce requests
        return userService.checkUsername(control.value).pipe(map((response: boolean) => {
          if (response) { return { async: true }; } // Property async can be checked for errors to allow custom message
          return null;
        }));
      }));
    };
  }

  /**
   * Validator that requires controls to not match an email in the database.
   * @param userService The userservice where the checkUsername method exists.
   */
  static emailAsync(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (isEmptyInputValue(control.value)) {
        return null;  // Don't validate empty values to allow optional controls
      }
      return timer(500).pipe(switchMap(() => { // Debounce requests
        return userService.checkEmail(control.value).pipe(map((response: boolean) => {
          if (response) { return { async: true }; } // Property async can be checked for errors to allow custom message
          return null;
        }));
      }));
    };
  }

  /**
   * Validator that requires controls to match an an other control in the same FormGroup.
   * @param controlName The name of the matching control.
   */
  static matchControl(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.parent) { return null; } // Might not be present on entry
      if (isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }

      const matchControl = control.parent.get(controlName);
      if (!matchControl) { throw new Error('match validator(): other control is not found in parent group'); }

      if (matchControl.value !== control.value) { return { noControlMatch: true }; }
      return null;
    };
  }

  /**
   * Validator that requires controls to match an an other control in the same FormGroup.
   * @param option Options object.
   */
  static matchPattern(options: PatternValidatorOptions): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }

      const errors: any = {};
      const value = control.value;

      const letterMatcher = /[a-zA-Z]/;
      const lowerCaseLetterMatcher = /[a-z]/;
      const upperCaseLetterMatcher = /[A-Z]/;
      const numberMatcher = /[0-9]/;
      const specialCharactersMatcher = /[-+=_.,:;~`!@#$%^&*(){}<>\[\]"'\/\\]/;

      // Minimum length.
      if (options.minLength > 0 && value.length < options.minLength) {
        errors.minLengthRequired = {
          minLength: options.minLength
        };
      }

      // Maximum length.
      if (options.maxLength >= 0 && value.length > options.maxLength) {
        errors.maxLengthExceeded = {
          maxLength: options.maxLength
        };
      }

      // Letters.
      if (options.requireLetters && !letterMatcher.test(value)) {
        errors.letterRequired = true;
      }

      // Lower-case letters.
      if (options.requireLowerCaseLetters && !lowerCaseLetterMatcher.test(value)) {
        errors.lowerCaseLetterRequired = true;
      }

      // Upper-case letters.
      if (options.requireUpperCaseLetters && !upperCaseLetterMatcher.test(value)) {
        errors.upperCaseLetterRequired = true;
      }

      // Numbers.
      if (options.requireNumbers && !numberMatcher.test(value)) {
        errors.numberRequired = true;
      }

      // Special characters.
      if (options.requireSpecialCharacters && !specialCharactersMatcher.test(value)) {
        errors.specialCharacterRequired = true;
      }

      // No special characters.
      if (options.noSpecialCharacters && specialCharactersMatcher.test(value)) {
        errors.noSpecialCharacter = true;
      }

      if (Object.keys(errors).length > 0) { return errors; }
      return null;
    };
  }
}

