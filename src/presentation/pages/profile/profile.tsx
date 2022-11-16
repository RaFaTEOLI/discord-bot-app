import { Heading, Flex, Stack, Input, useToast } from '@chakra-ui/react';
import { LoadUser } from '@/domain/usecases';
import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { userProfileState } from './components/atoms/atom';
import { useErrorHandler } from '@/presentation/hooks';

type Props = {
  loadUser: LoadUser;
};

export default function Profile({ loadUser }: Props): JSX.Element {
  const resetSurveyListState = useResetRecoilState(userProfileState);
  const [state, setState] = useRecoilState(userProfileState);
  const toast = useToast();

  const handleError = useErrorHandler((error: Error) => {
    toast({
      title: 'Load Profile Error',
      description: error.message || 'There was an error while trying to load your profile',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top-right'
    });
  });

  useEffect(() => {
    (async () => {
      resetSurveyListState();
      try {
        const userProfile = await loadUser.load();
        setState(prev => ({ ...prev, userProfile }));
      } catch (error) {
        handleError(error as Error);
      }
    })();
  }, []);

  return (
    <Flex flexDirection="column">
      <Heading mb={5}>Profile</Heading>
      <Stack>
        <Input placeholder="Name" size="sm" value={state.userProfile.display_name} />
      </Stack>
    </Flex>
  );
}
