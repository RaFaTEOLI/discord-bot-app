import { Heading, Flex, Avatar, Text, VStack, useToast } from '@chakra-ui/react';
import { LoadUser } from '@/domain/usecases';
import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { userProfileState } from './components/atoms/atom';
import { useErrorHandler } from '@/presentation/hooks';
import { Loading } from '@/presentation/components';

type Props = {
  loadUser: LoadUser;
};

export default function Profile({ loadUser }: Props): JSX.Element {
  const resetSurveyListState = useResetRecoilState(userProfileState);
  const [state, setState] = useRecoilState(userProfileState);
  const toast = useToast();

  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, loading: false }));
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
        setState(prev => ({ ...prev, userProfile, loading: false }));
      } catch (error) {
        handleError(error as Error);
      }
    })();
  }, []);

  return (
    <Flex flexDirection="column">
      <Heading mb={5}>Profile</Heading>
      {state.loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Loading />
        </Flex>
      ) : (
        <Flex>
          <Avatar
            mr={5}
            size="2xl"
            data-testid="avatar"
            name={state.userProfile.display_name}
            src={state.userProfile.images[0].url}
          />
          <VStack spacing={1} align="stretch">
            <Text fontSize="5xl" data-testid="name">
              {state.userProfile.display_name}
            </Text>
            <Text fontSize="md" data-testid="email">
              {state.userProfile.email}
            </Text>
          </VStack>
        </Flex>
      )}
    </Flex>
  );
}
