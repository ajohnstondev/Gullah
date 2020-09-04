import {Link} from 'blitz'
import styled from 'styled-components'
import { useCurrentUser } from "app/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"


const NavWrapper = styled.div`

`

const NavItem = styled.div`
  display: inline-block;
  margin-left: 14px;
`

const UserInfo = () => {
  const currentUser = useCurrentUser()
  if(currentUser) {
    return (
      <NavWrapper>

        {!currentUser.storefront && <NavItem>
          <Link href="/storefronts/new">
            <a>Create Storefront</a>
          </Link>
        </NavItem>}

        {currentUser.storefront && <><NavItem>
          <Link href="/products/new">
            <a>New Product</a>
          </Link></NavItem>

          <NavItem><Link href={`/storefronts/${currentUser.storefront.id}`}>
            <a>My Store</a>
          </Link></NavItem></>
        }


        <NavItem>
          <button
            className="button small"
            onClick={async () => {
              await logout()
            }}
          >
            Logout
          </button>
        </NavItem>
      </NavWrapper>
    )
  } else {
    return (
      <NavWrapper>
        <NavItem>
          <Link href="/signup">
            <a>
              Sign Up
            </a>
          </Link>
        </NavItem>

        <NavItem>
          <Link href="/login">
            <a>
              Login
            </a>
          </Link>
        </NavItem>

    </NavWrapper>
    )
  }
}

export default UserInfo