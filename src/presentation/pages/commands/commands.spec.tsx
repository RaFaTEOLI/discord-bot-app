import { Helper, renderWithHistory } from '@/presentation/mocks';
import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { setTimeout } from 'timers/promises';
import userEvent from '@testing-library/user-event';
import Commands from './commands';

const simulateInvalidSubmit = async (): Promise<void> => {
  const submitButton = screen.getByTestId('submit');
  await userEvent.click(submitButton);
};

const history = createMemoryHistory({ initialEntries: ['/commands'] });
const makeSut = (): void => {
  renderWithHistory({
    history,
    useAct: true,
    Page: () => Commands()
  });
};

describe('Commands Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('should have commands page content', () => {
    makeSut();
    const pageContent = screen.getByRole('heading', {
      name: 'Commands'
    });
    expect(pageContent).toBeInTheDocument();
  });

  test('should render Commands on success', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    expect(commandsList.children).toHaveLength(8);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('should render CommandModal on command view click', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    userEvent.click(commandsList.querySelector('.command-view-button') as Element);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    expect(screen.getByTestId('command')).toHaveValue();
    expect(screen.getByTestId('description')).toHaveValue();
    expect(screen.getByTestId('type')).toHaveValue();
    expect(screen.getByTestId('dispatcher')).toHaveValue();
  });

  test('should show form errors', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    userEvent.click(screen.getByTestId('new-command'));
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    await simulateInvalidSubmit();
    await setTimeout(1000);
    Helper.testStatusForField('command', 'Required field');
    Helper.testStatusForField('description', 'Required field');
    Helper.testStatusForField('type', 'Required field');
    Helper.testStatusForField('dispatcher', 'Required field');
  });

  test('should close CommandModal on close', async () => {
    makeSut();
    const commandsList = await screen.findByTestId('commands-list');
    await waitFor(() => commandsList);
    userEvent.click(commandsList.querySelector('.command-view-button') as Element);
    const commandForm = await screen.findByTestId('form');
    await waitFor(() => commandForm);
    expect(commandForm).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('close-modal'));
    await setTimeout(500);
    expect(commandForm).not.toBeInTheDocument();
  });
});
