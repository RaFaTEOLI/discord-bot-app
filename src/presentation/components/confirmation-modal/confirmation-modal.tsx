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
}

const ConfirmationModal = ({ onClose, isOpen, confirm, loading }: IProps): JSX.Element => {
  const handleClick = (): void => {
    confirm();
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
                <Text>{"Once it's done it can't be undone!"}</Text>
              </ModalBody>

              <ModalFooter>
                <Button data-testid="confirmation-cancel-button" size="sm" colorScheme="red" mr={3} onClick={onClose}>
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