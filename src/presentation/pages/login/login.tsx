import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { loginState, Input, SubmitButton, LoginSpotifyButton, FormStatus } from './components';
import { currentAccountState, Switcher } from '@/presentation/components';
import { Authentication, SpotifyAuthorize, SpotifyRequestToken } from '@/domain/usecases';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { Flex, Heading, Box, Stack, Avatar, useColorModeValue, chakra } from '@chakra-ui/react';
import { FiLock, FiMail, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const CFiMail = chakra(FiMail);
const CFiLock = chakra(FiLock);
const CFiLogIn = chakra(FiLogIn);

type Props = {
  authentication: Authentication;
  spotifyAuthorize: SpotifyAuthorize;
  spotifyRequestToken: SpotifyRequestToken;
};

const schema = yupResolver(
  yup
    .object()
    .shape({
      email: yup.string().email().required('Required field'),
      password: yup.string().required('Required field')
    })
    .required()
);

const Login = ({ authentication, spotifyAuthorize, spotifyRequestToken }: Props): JSX.Element => {
  const [searchParams] = useSearchParams();
  const bgSide = useColorModeValue('gray.100', 'gray.900');
  const resetLoginState = useResetRecoilState(loginState);
  const { setCurrentAccount } = useRecoilValue(currentAccountState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useRecoilState(loginState);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Authentication.Params>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: schema
  });

  useEffect(() => resetLoginState(), []);
  useEffect(() => {
    setState(prev => ({
      ...prev,
      register,
      errors
    }));
  }, [register, errors]);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (code && state) {
      spotifyRequestToken.request({ code, state });
    }
  }, [searchParams]);

  const onSubmit = handleSubmit(async data => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const account = await authentication.auth({
        email: data.email,
        password: data.password
      });
      setCurrentAccount(account);
      navigate('/');
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        mainError: error.message
      }));
    }
  });

  const onSpotifyLogin = async (): Promise<void> => {
    const url = await spotifyAuthorize.authorize();
    window.location.href = url;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Flex width="100vw" height="100vh">
        <Flex width={{ base: '100vw' }} justifyContent={['center', 'center', 'center', 'space-between']} alignItems="center">
          <Box
            bgColor={bgSide}
            h="100%"
            w={['0%', '0%', '0%', '50%']}
            display={['none', 'none', 'none', 'flex']}
            alignItems="center"
          >
            <Flex w="full" gap={5} justifyContent="center" alignItems="center" flexDir="column" mb={5}>
              <Avatar
                size="2xl"
                outline="1px solid #000"
                name={process.env.VITE_BOT_NAME}
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                src={`https://robohash.org/${process.env.VITE_BOT_NAME}`}
              />
              <Heading textAlign="center" zIndex={4}>
                Discord Bot App - {process.env.VITE_BOT_NAME}
              </Heading>
            </Flex>
          </Box>
          <Box
            w={['100%', 'full', '100%', '50%']}
            h={'full'}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDir="column"
            zIndex={3}
            p={8}
          >
            <Box w="full" px={8} display="flex" justifyContent="flex-start">
              <Heading size="2xl">Login</Heading>
            </Box>

            <form style={{ width: '100%' }} data-testid="form" onSubmit={onSubmit}>
              <Box w="full" px="8" borderRadius="10px">
                <Stack spacing={4} py="6">
                  <Input type="email" name="email" placeholder="E-mail" icon={<CFiMail />} />
                  <Input type="password" name="password" placeholder="Password" icon={<CFiLock />} />

                  <SubmitButton text="Login" icon={<CFiLogIn />} />
                  <LoginSpotifyButton onClick={onSpotifyLogin} text="Login with Spotify" />
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDir="column">
                      <Link data-testid="signup-link" to="/signup">
                        Create account
                      </Link>
                    </Box>
                    <Switcher />
                  </Flex>
                  <FormStatus />
                </Stack>
              </Box>
            </form>
          </Box>
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Login;
