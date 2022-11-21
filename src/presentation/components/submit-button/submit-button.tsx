import { Button } from '@chakra-ui/react';

type Props = {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
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
