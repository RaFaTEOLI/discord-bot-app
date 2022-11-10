/* eslint-disable no-global-assign */
import { renderWithHistory } from '@/presentation/mocks';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import Layout from './layout';

const history = createMemoryHistory({ initialEntries: ['/'] });
const makeSut = (): void => {
  renderWithHistory({
    history,
    useAct: true,
    Page: () => Layout()
  });
};

describe('Layout Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have home page as active on initial state', () => {
    makeSut();
    const homeNavItem = screen.getByTestId('home');
    const homeNavText = screen.getByTestId('home-text');
    const homeNavFlex = screen.getByTestId('nav-flex');
    expect(homeNavItem).toBeInTheDocument();
    expect(homeNavItem).toHaveAttribute('data-status', 'active');
    expect(homeNavItem).toHaveAttribute('data-size', 'large');
    expect(homeNavText).toHaveTextContent('Home');
    expect(homeNavText).toHaveStyle('display: flex');
    expect(homeNavFlex).toHaveAttribute('data-status', 'large');
  });

  test('should navigate to commands page', async () => {
    makeSut();
    const commandsNavlink = screen.getByTestId('commands-link');
    await userEvent.click(commandsNavlink);
    expect(history.location.pathname).toBe('/commands');
  });

  test('should have page outlet', () => {
    makeSut();
    const pageOutlet = screen.getByTestId('page-outlet');
    expect(pageOutlet).toBeInTheDocument();
  });

  test('show toggle sidebar on bot name click', async () => {
    makeSut();
    const botName = screen.getByTestId('bot-name');
    await userEvent.click(botName);
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'small');
  });

  test('show toggle sidebar on bot logo click', async () => {
    makeSut();
    const botName = screen.getByTestId('bot-logo');
    await userEvent.click(botName);
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'small');
  });

  test('show render small layout', () => {
    window = Object.assign(window, { innerWidth: 766 });
    makeSut();
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'small');
    expect(screen.getByTestId('home')).toHaveAttribute('data-size', 'small');
    expect(screen.getByTestId('home-text')).toHaveStyle('display: none');
  });

  test('show render small layout then resize to a big one', async () => {
    window = Object.assign(window, { innerWidth: 766 });
    makeSut();
    const botName = screen.getByTestId('bot-logo');
    await userEvent.click(botName);
    expect(screen.getByTestId('nav-flex')).toHaveAttribute('data-status', 'large');
  });
});
