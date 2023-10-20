import { faker } from '@faker-js/faker';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const testStatusForField = (fieldName: string, validationError = ''): void => {
  const wrap = screen.getByTestId(`${fieldName}-wrap`);
  const field = screen.getByTestId(`${fieldName}`);
  const label = screen.getByTestId(`${fieldName}-label`);
  expect(wrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid');
  expect(field).toHaveProperty('title', validationError);
  expect(label).toHaveProperty('title', validationError);
};

export const testValueForField = (fieldId: string, value: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const field = screen.getByTestId(fieldId) as HTMLInputElement;
  expect(field.value).toBe(value);
};

export const populateField = (fieldName: string, value = faker.random.word(), select = false): void => {
  const input = screen.getByTestId(fieldName);
  if (select) {
    fireEvent.change(input, { target: { value } });
  } else {
    fireEvent.input(input, { target: { value } });
  }
};

export const asyncPopulateField = async (fieldName: string, value = faker.random.word(), select = false): Promise<void> => {
  const input = screen.getByTestId(fieldName);
  if (select) {
    await userEvent.selectOptions(input, value);
  } else {
    await userEvent.type(input, value);
  }
};
