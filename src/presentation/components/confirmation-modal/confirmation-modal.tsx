import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex,
  Spinner
} from '@chakra-ui/react';

interface IProps {
  onClose: () => void;
  isOpen: boolean;
  confirm: () => any;
  loading: boolean;
  reject?: () => any;
  description?: string | null;
}

const ConfirmationModal = ({
  onClose,
  isOpen,
  confirm,
  loading,
  reject = () => {},
  description = "Once it's done it can't be undone!"
}: IProps): JSX.Element => {
  const handleClick = (): void => {
    confirm();
  };

  const handleClose = (): void => {
    reject();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {loading ? (
            <Flex alignContent="center" justifyContent="center" padding="10">
              <Spinner data-testid="loading-spinner" size="xl" />
            </Flex>
          ) : (
            <>
              <ModalHeader data-testid="confirmation-modal-header">Are you sure?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text data-testid="confirmation-modal-description">{description}</Text>
              </ModalBody>

              <ModalFooter>
                <Button data-testid="confirmation-cancel-button" size="sm" colorScheme="red" mr={3} onClick={handleClose}>
                  No
                </Button>
                <Button data-testid="confirmation-confirm-button" size="sm" colorScheme="green" onClick={handleClick}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
