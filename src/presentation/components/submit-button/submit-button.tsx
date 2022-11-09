import { Button } from '@chakra-ui/react';

type Props = {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  icon?: JSX.Element | undefined;
  isLoading?: boolean;
};

const SubmitButton = ({ text, icon, ...props }: Props): JSX.Element => {
  return (
    <Button {...props} variant="solid" w="full" leftIcon={icon} data-testid="submit" type="submit">
      {text}
    </Button>
  );
};

export default SubmitButton;
