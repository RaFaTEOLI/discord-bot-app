import { fireEvent, render, RenderResult } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { InputBase } from '@/presentation/components';

const makeSut = (fieldName: string, placeholder = ''): RenderResult => {
  return render(<InputBase name={fieldName} state={{}} setState={null} placeholder={placeholder} />);
};

describe('Input Component', () => {
  test('should begin with readOnly', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const input = sut.getByTestId(field) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  test('should remove readOnly on focus', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const input = sut.getByTestId(field) as HTMLInputElement;
    fireEvent.focus(input);
    expect(input.readOnly).toBe(false);
  });

  test('should have label with props from placeholder', () => {
    const field = faker.database.column();
    const sut = makeSut(field, field);
    const label = sut.getByTestId(`${field}-label`);
    expect(label).toBeInTheDocument();
    expect(label.innerHTML).toBe(field);
  });
});
