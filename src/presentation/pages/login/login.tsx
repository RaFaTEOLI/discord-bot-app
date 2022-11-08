import { useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { loginState, Input, SubmitButton, FormStatus } from './components';
import { currentAccountState, Switcher } from '@/presentation/components';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication } from '@/domain/usecases';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { Flex, Heading, Box, Stack, Avatar, useColorModeValue, chakra } from '@chakra-ui/react';
import { FiLock, FiMail, FiLogIn } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CFiMail = chakra(FiMail);
const CFiLock = chakra(FiLock);
const CFiLogIn = chakra(FiLogIn);

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login = ({ validation, authentication }: Props) => {
  const bgSide = useColorModeValue('gray.100', 'gray.900');
  const resetLoginState = useResetRecoilState(loginState);
  const { setCurrentAccount } = useRecoilValue(currentAccountState);
  const [state, setState] = useRecoilState(loginState);

  const navigate = useNavigate();

  const validate = (field: string): void => {
    const { email, password } = state;
    const formData = { email, password };
    setState(prev => ({
      ...prev,
      [`${field}Error`]: validation.validate(field, formData)
    }));
    setState(prev => ({
      ...prev,
      isFormInvalid: !!prev.emailError || !!prev.passwordError
    }));
  };

  useEffect(() => resetLoginState(), []);
  useEffect(() => validate('email'), [state.email]);
  useEffect(() => validate('password'), [state.password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }
      setState(prev => ({ ...prev, isLoading: true }));
      const account = await authentication.auth({
        email: state.email,
        password: state.password
      });
      setCurrentAccount(account);
      navigate('/');
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message
      });
    }
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

            <form style={{ width: '100%' }} data-testid="form" onSubmit={handleSubmit}>
              <Box w="full" px="8" borderRadius="10px">
                <Stack spacing={4} py="6">
                  <Input type="email" name="email" placeholder="E-mail" icon={<CFiMail />} />
                  <Input type="password" name="password" placeholder="Password" icon={<CFiLock />} />

                  <SubmitButton text="Login" icon={<CFiLogIn />} />
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
