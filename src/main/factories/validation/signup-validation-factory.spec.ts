import { makeSignUpValidation } from '@/main/factories/validation';
import { ValidationComposite } from '@/main/composites';
import {
  RequiredFieldValidation,
  MinLengthValidation,
  EmailValidation,
  CompareFieldsValidation
} from '@/validation/validators';

describe('SignUpValidationFactory', () => {
  test('should make ValidationComposite with correct validations', () => {
    const composite = makeSignUpValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        new RequiredFieldValidation('name'),
        new MinLengthValidation('name', 2),
        new RequiredFieldValidation('email'),
        new EmailValidation('email'),
        new RequiredFieldValidation('password'),
        new MinLengthValidation('password', 5),
        new RequiredFieldValidation('passwordConfirmation'),
        new CompareFieldsValidation('passwordConfirmation', 'password')
      ])
    );
  });
});
