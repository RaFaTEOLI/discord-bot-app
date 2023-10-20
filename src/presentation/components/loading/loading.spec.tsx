import { render, RenderResult } from '@testing-library/react';
import Loading from './loading';
import { describe, test, expect } from 'vitest';

const makeSut = (): RenderResult => {
  return render(<Loading />);
};

describe('Loading Component', () => {
  test('should show loading', () => {
    const sut = makeSut();
    expect(sut.getByTestId('loading')).toBeTruthy();
  });
});
