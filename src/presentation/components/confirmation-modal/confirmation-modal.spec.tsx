import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmationModal from './confirmation-modal';

type SutTypes = {
  sut: RenderResult;
  onClose: () => void;
  onConfirm: () => void;
};

const makeSut = (loading = false): SutTypes => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();
  const isOpen = true;

  const sut = render(<ConfirmationModal isOpen={isOpen} onClose={onClose} confirm={onConfirm} loading={loading} />);

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
    expect(modalHeader).toBeInTheDocument();
    expect(modalHeader.innerHTML).toBe('Are you sure?');
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
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('should not show spinner if loading is false', async () => {
    const { sut } = makeSut();
    const loadingSpinner = sut.queryByTestId('loading-spinner');
    expect(loadingSpinner).not.toBeInTheDocument();
  });
});
