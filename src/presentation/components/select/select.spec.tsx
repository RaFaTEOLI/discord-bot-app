import { render, RenderResult } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { SelectBase } from '@/presentation/components';

const makeSut = (fieldName: string, placeholder = ''): RenderResult => {
  return render(
    <SelectBase
      options={[{ label: 'test', value: 'test' }]}
      name={fieldName}
      state={{}}
      setState={null}
      placeholder={placeholder}
    />
  );
};

describe('Select Component', () => {
  test('should have label with props from placeholder', () => {
    const field = faker.database.column();
    const sut = makeSut(field, field);
    const label = sut.getByTestId(`${field}-label`);
    expect(label).toBeInTheDocument();
    expect(label.innerHTML).toBe(field);
  });
});
