import { faker } from '@faker-js/faker';
import DiscordStatusBadge from './discord-status-badge';
import { RenderResult, render } from '@testing-library/react';
import { CommandDiscordStatus } from '@/domain/models';

const makeSut = (
  value = faker.helpers.arrayElement(['SENT', 'RECEIVED', 'FAILED']) as CommandDiscordStatus
): RenderResult => {
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
});
