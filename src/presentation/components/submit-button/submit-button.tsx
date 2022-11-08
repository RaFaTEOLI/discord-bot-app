import { Button } from '@chakra-ui/react';

type Props = {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  icon?: JSX.Element | undefined;
};

const SubmitButton = ({ state, text, icon }: Props) => {
  return (
    <Button variant="solid" w="full" leftIcon={icon} data-testid="submit" isDisabled={state.isFormInvalid} type="submit">
      {text}
    </Button>
  );
};

export default SubmitButton;
