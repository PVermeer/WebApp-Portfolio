import { FormControl } from '@angular/forms';

export interface UsernameValidatorOptions {
  minLength?: number;
  maxLength?: number;
  requireLetters?: boolean;
  requireLowerCaseLetters?: boolean;
  requireUpperCaseLetters?: boolean;
  requireNumbers?: boolean;
  noSpecialCharacters?: boolean;
}

export function usernameValidator(options: UsernameValidatorOptions) {

  const validator = new UsernameValidator(options);

  return function validateUsername(control: FormControl) {
    return validator.validate(control.value);
  };

}

export class UsernameValidator {

  private letterMatcher = /[a-zA-Z]/;
  private lowerCaseLetterMatcher = /[a-z]/;
  private upperCaseLetterMatcher = /[A-Z]/;
  private numberMatcher = /[0-9]/;
  private usernameMatcher = /^[a-z0-9_-\s]+$/i;

  constructor(private options: UsernameValidatorOptions) {
  }

  validate(value: string): any {

    if (!value) {
      return null;
    }

    const errors: any = {};

    // Minimum length.
    if (this.options.minLength > 0 && value.length < this.options.minLength) {
      errors.usernameMinLengthRequired = {
        minLength: this.options.minLength
      };
    }

    // Maximum length.
    if (this.options.maxLength >= 0 && value.length > this.options.maxLength) {
      errors.usernameMaxLengthExceeded = {
        maxLength: this.options.maxLength
      };
    }

    // Letters.
    if (this.options.requireLetters && !this.letterMatcher.test(value)) {
      errors.usernameLetterRequired = true;
    }

    // Lower-case letters.
    if (this.options.requireLowerCaseLetters && !this.lowerCaseLetterMatcher.test(value)) {
      errors.usernameLowerCaseLetterRequired = true;
    }

    // Upper-case letters.
    if (this.options.requireUpperCaseLetters && !this.upperCaseLetterMatcher.test(value)) {
      errors.usernameUpperCaseLetterRequired = true;
    }

    // Numbers.
    if (this.options.requireNumbers && !this.numberMatcher.test(value)) {
      errors.usernameNumberRequired = true;
    }

    // No special characters.
    if (!this.usernameMatcher.test(value)) {
      errors.usernameNoSpecialCharacters = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;

  }

}
