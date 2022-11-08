import { render, RenderResult } from '@testing-library/react';
import Switcher from './switcher';

const makeSut = (): RenderResult => {
  return render(<Switcher />);
};

jest.mock('@chakra-ui/react', () => {
  // --> Original module
  const originalModule = jest.requireActual('@chakra-ui/react');

  return {
    __esModule: true,
    ...originalModule,
    useColorMode: jest.fn().mockImplementation(() => {
      return {
        colorMode: 'light',
        toggleColorMode: () => {}
      };
    })
  };
});

describe('Switcher Component', () => {
  test('should change theme mode to light', async () => {
    const sut = makeSut();
    expect(sut.getByTestId('moon')).toBeInTheDocument();
  });
});
