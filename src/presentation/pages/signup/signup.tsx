import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { signUpState, FormStatus } from './components';
import { currentAccountState, Input, SpotifyButton, Switcher } from '@/presentation/components';
import { AddAccount, SpotifyAuthorize } from '@/domain/usecases';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { Flex, Heading, Box, Stack, Avatar, useColorModeValue, chakra, Button } from '@chakra-ui/react';
import { FiLock, FiMail, FiCheck, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const CFiUser = chakra(FiUser);
const CFiMail = chakra(FiMail);
const CFiLock = chakra(FiLock);
const CFiCheck = chakra(FiCheck);

type Props = {
  addAccount: AddAccount;
  spotifyAuthorize: SpotifyAuthorize;
};

const schema = yupResolver(
  yup
    .object()
    .shape({
      name: yup.string().required('Required field'),
      email: yup.string().email().required('Required field'),
      password: yup.string().required('Required field'),
      passwordConfirmation: yup
        .string()
        .required('Required field')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
    })
    .required()
);

const SignUp: React.FC<Props> = ({ addAccount, spotifyAuthorize }: Props) => {
  const bgSide = useColorModeValue('gray.100', 'gray.900');
  const resetSignUpState = useResetRecoilState(signUpState);
  const { setCurrentAccount } = useRecoilValue(currentAccountState);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useRecoilState(signUpState);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<AddAccount.Params>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: schema
  });

  useEffect(() => resetSignUpState(), []);

  const onSubmit = handleSubmit(async data => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const account = await addAccount.add({
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation
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

  const onSpotifySignUp = async (): Promise<void> => {
    const url = await spotifyAuthorize.authorize();
    window.location.href = url;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Flex width="100vw" height="100vh">
        <Flex width={{ base: '100vw' }} justifyContent={['center', 'center', 'center', 'space-between']} alignItems="center">
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
              <Heading size="2xl">Sign Up</Heading>
            </Box>

            <form style={{ width: '100%' }} data-testid="form" onSubmit={onSubmit}>
              <Box w="full" px="8" borderRadius="10px">
                <Stack spacing={4} py="6">
                  <Input type="text" placeholder="Name" icon={<CFiUser />} errors={errors} {...register('name')} />
                  <Input type="email" placeholder="E-mail" icon={<CFiMail />} errors={errors} {...register('email')} />
                  <Input
                    type="password"
                    placeholder="Password"
                    icon={<CFiLock />}
                    errors={errors}
                    {...register('password')}
                  />
                  <Input
                    type="password"
                    placeholder="Password Confirmation"
                    icon={<CFiLock />}
                    errors={errors}
                    {...register('passwordConfirmation')}
                  />

                  <Button
                    isDisabled={!isValid}
                    variant="solid"
                    w="full"
                    leftIcon={<CFiCheck />}
                    data-testid="submit"
                    type="submit"
                    isLoading={state.isLoading}
                  >
                    Sign Up
                  </Button>
                  <SpotifyButton onClick={onSpotifySignUp} isLoading={state.isLoading} text="Sign Up with Spotify" />
                  <FormStatus />
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box display="flex" flexDir="column">
                      <Link data-testid="login-link" to="/login">
                        Back to Login
                      </Link>
                    </Box>
                    <Switcher />
                  </Flex>
                </Stack>
              </Box>
            </form>
          </Box>
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
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default SignUp;
