import { faker } from '@faker-js/faker';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Error from './error';
import { describe, test, expect, vi } from 'vitest';

const makeSut = (): { sut: RenderResult; error: string; reload: () => void } => {
  const reload = vi.fn();
  const error = faker.random.words();
  const sut = render(<Error error={error} reload={reload} />);
  return {
    sut,
    error,
    reload
  };
};

describe('Error Component', () => {
  test('should show error', async () => {
    const { sut, error, reload } = makeSut();
    const errorElement = sut.getByTestId('error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.innerHTML).toContain(error);
    await userEvent.click(sut.getByTestId('reload'));
    expect(reload).toHaveBeenCalled();
  });
});
