import { memo, MouseEvent } from 'react';
import { Logo, currentAccountState } from '@/presentation/components';
import { useLogout } from '@/presentation/hooks';
import { useRecoilValue } from 'recoil';

const Header = (): JSX.Element => {
  const logout = useLogout();
  const { getCurrentAccount } = useRecoilValue(currentAccountState);

  const buttonClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    logout();
  };

  return (
    <header>
      <div>
        <Logo />
        <div>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a data-testid="logout" href="#" onClick={buttonClick}>
            Logout
          </a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
