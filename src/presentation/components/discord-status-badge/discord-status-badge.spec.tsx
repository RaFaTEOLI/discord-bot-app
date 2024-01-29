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
});
