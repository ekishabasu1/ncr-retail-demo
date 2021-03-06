import { useState } from 'react';
import { useSession, signOut } from 'next-auth/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Spinner,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Nav,
} from 'reactstrap';
import { useRouter } from 'next/router';
function ProfileDropdown({ toggleModalLogin }) {
  const router = useRouter();
  const [session, loading] = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);
  return (
    <div className="d-inline-block">
      {!loading && (!session || !session.user) ? (
        <Button color="primary" onClick={toggleModalLogin}>
          Login
        </Button>
      ) : loading ? (
        <Button color="primary">
          <Spinner color="light" size="sm" />
        </Button>
      ) : (
        // <p>{session.user.givenName}</p>
        <Nav pills>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret className="text-white">
              <FontAwesomeIcon icon={faUser} /> {session.user.givenName}
            </DropdownToggle>
            <DropdownMenu>
              {/* <DropdownItem>
                <Link href="/user/orders">Recent Orders</Link>
              </DropdownItem> */}
              <DropdownItem
                onClick={() =>
                  router.push({
                    pathname: '/user/profile',
                  })
                }
              >
                Profile
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  router.push({
                    pathname: '/user/orders',
                  })
                }
              >
                Orders
              </DropdownItem>
              {/* <DropdownItem
                onClick={() =>
                  router.push({
                    pathname: '/user/payments',
                  })
                }
              >
                Payments
              </DropdownItem> */}
              <DropdownItem divider />
              <DropdownItem onClick={() => signOut({ callbackUrl: '/' })}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      )}
    </div>
  );
}

export default ProfileDropdown;
