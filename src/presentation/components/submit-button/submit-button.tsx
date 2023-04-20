import { Button } from '@chakra-ui/react';

export type Props = {
  text: string;
  icon?: JSX.Element | undefined;
  isLoading?: boolean;
  isDisabled?: boolean;
};

const SubmitButton = ({ text, isDisabled = false, icon, ...props }: Props): JSX.Element => {
  return (
    <Button {...props} isDisabled={isDisabled} variant="solid" w="full" leftIcon={icon} data-testid="submit" type="submit">
      {text}
    </Button>
  );
};

export default SubmitButton;
