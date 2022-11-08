import { InvalidFieldError } from '@/validation/errors';
import { CompareFieldsValidation } from '@/validation/validators';
import { faker } from '@faker-js/faker';

const makeSut = (field: string, fieldToCompare: string): CompareFieldsValidation =>
  new CompareFieldsValidation(field, fieldToCompare);

describe('CompareFieldsValidation', () => {
  test('should return error if comparison does not match', () => {
    const field = faker.database.column();
    const fieldToCompare = faker.database.column();
    const sut = makeSut(field, fieldToCompare);
    const error = sut.validate({ [field]: faker.random.words(3), [fieldToCompare]: `_${faker.random.words(4)}` });
    expect(error).toEqual(new InvalidFieldError());
  });

  test('should return false if comparison is valid', () => {
    const field = faker.database.column();
    const fieldToCompare = faker.database.column();
    const sut = makeSut(field, fieldToCompare);
    const value = faker.random.word();
    const error = sut.validate({ [field]: value, [fieldToCompare]: value });
    expect(error).toBeFalsy();
  });
});
