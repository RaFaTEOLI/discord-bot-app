import { InvalidFieldError } from '@/validation/errors';
import { MinLengthValidation } from '@/validation/validators';
import { faker } from '@faker-js/faker';

const makeSut = (field: string): MinLengthValidation => new MinLengthValidation(field, 5);

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.datatype.string(4) });
    expect(error).toEqual(new InvalidFieldError());
  });

  test('should return false if value is valid', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.datatype.string(5) });
    expect(error).toBeFalsy();
  });

  test('should return false if field does not exist in schema', () => {
    const sut = makeSut(faker.database.column());
    const error = sut.validate({ [`_${faker.database.column()}`]: faker.datatype.string(5) });
    expect(error).toBeFalsy();
  });
});
