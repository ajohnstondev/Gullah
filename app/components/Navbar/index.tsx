import React, {Suspense} from 'react'
import { Link } from "blitz"
import styled from 'styled-components'
import Nav from './Nav'

const Wrapper = styled.div`
  background: ${props => props.theme.colors.white};
  max-width: ${props => props.theme.sizes.maxWidth};
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const LogoWrapper = styled.div`
  flex: 1;
`

const NavWrapper = styled.div`

`

const Navbar = () => {


  return (
    <Wrapper>

        <LogoWrapper>
          <Link href="/">
            <a>Gullah</a>
          </Link>
        </LogoWrapper>

        
        <NavWrapper>
          <Suspense fallback="Loading">
            <Nav />
          </Suspense>
        </NavWrapper>

    </Wrapper>

  )
}

export default Navbar