import { faker } from '@faker-js/faker';
import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';

import ConfirmationModal from './confirmation-modal';

type SutTypes = {
  sut: RenderResult;
  onClose: () => void;
  onConfirm: () => void;
};

const makeSut = (loading = false, description: string | null = null): SutTypes => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  const isOpen = true;

  const sut = render(
    <ConfirmationModal isOpen={isOpen} onClose={onClose} confirm={onConfirm} loading={loading} description={description} />
  );

  return {
    sut,
    onClose,
    onConfirm
  };
};

describe('ConfirmationModal', () => {
  test('should render ConfirmationModal component', () => {
    const { sut } = makeSut();
    const modalHeader = sut.getByTestId('confirmation-modal-header');
    expect(modalHeader).toBeTruthy();
    expect(modalHeader.innerHTML).toBe('Are you sure?');
  });

  test('should render ConfirmationModal component with description', () => {
    const description = faker.random.word();
    const { sut } = makeSut(false, description);
    const modalDescription = sut.getByTestId('confirmation-modal-description');
    expect(modalDescription).toBeTruthy();
    expect(modalDescription.innerHTML).toBe(description);
  });

  test('should confirm modal', async () => {
    const { sut, onConfirm } = makeSut();
    const confirmButton = sut.getByTestId('confirmation-confirm-button');
    await userEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalled();
  });

  test('should close the modal', async () => {
    const { sut, onClose } = makeSut();
    const cancelButton = sut.getByTestId('confirmation-cancel-button');
    await userEvent.click(cancelButton);
    expect(onClose).toBeCalled();
  });

  test('should show spinner if loading is true', async () => {
    const { sut } = makeSut(true);
    const loadingSpinner = sut.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeTruthy();
  });

  test('should not show spinner if loading is false', async () => {
    const { sut } = makeSut();
    const loadingSpinner = sut.queryByTestId('loading-spinner');
    expect(loadingSpinner).not.toBeTruthy();
  });
});
