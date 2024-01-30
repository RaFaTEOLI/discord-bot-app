import DiscordStatusBadge from './discord-status-badge';
import { RenderResult, render } from '@testing-library/react';
import { CommandDiscordStatus } from '@/domain/models';
import userEvent from '@testing-library/user-event';

const makeSut = (value: CommandDiscordStatus | undefined): RenderResult => {
  return render(<DiscordStatusBadge value={value} />);
};

describe('DiscordStatusBadge Component', () => {
  test('should render SENT badge', async () => {
    const screen = makeSut(CommandDiscordStatus.SENT);
    expect(screen.getByTestId('discord-status-badge').textContent).toBe('Sent');
  });

  test('should render RECEIVED badge', async () => {
    const screen = makeSut(CommandDiscordStatus.RECEIVED);
    expect(screen.getByTestId('discord-status-badge').textContent).toBe('Received');
  });

  test('should render FAILED badge', async () => {
    const screen = makeSut(CommandDiscordStatus.FAILED);
    expect(screen.getByTestId('discord-status-badge').textContent).toBe('Failed');
  });

  test('should render DEFAULT badge', async () => {
    const screen = makeSut(undefined);
    expect(screen.getByTestId('discord-status-badge').textContent).toBe('Not Sent');
    await userEvent.click(screen.getByTestId('discord-status-badge'));
    expect(screen.getByText('To send command to Discord API please save command')).toBeTruthy();
  });
});
