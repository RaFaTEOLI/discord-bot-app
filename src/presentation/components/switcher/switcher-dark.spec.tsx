import { render, RenderResult } from '@testing-library/react';
import Switcher from './switcher';

const makeSut = (): RenderResult => {
  return render(<Switcher />);
};

describe('Switch Component', () => {
  test('should change theme mode to dark', async () => {
    const sut = makeSut();
    expect(sut.getByTestId('sun')).toBeInTheDocument();
  });
});
