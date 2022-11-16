import { useLogout } from '@/presentation/hooks';
import { AccessDeniedError, AccessTokenExpiredError } from '@/domain/errors';

type CallbackType = (error: Error) => void;
type ResultType = CallbackType;

export const useErrorHandler = (callback: CallbackType): ResultType => {
  const logout = useLogout();
  return (error: Error): void => {
    if (error instanceof AccessDeniedError || error instanceof AccessTokenExpiredError) {
      logout();
    } else {
      callback(error);
    }
  };
};
