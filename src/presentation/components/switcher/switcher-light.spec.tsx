import { render, RenderResult } from '@testing-library/react';
import Switcher from './switcher';
import { describe, test, expect, vi } from 'vitest';

const makeSut = (): RenderResult => {
  return render(<Switcher />);
};

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...(actual as any),
    useColorMode: vi.fn().mockImplementation(() => {
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
    expect(sut.getByTestId('sun')).toBeTruthy();
  });
});
