import React from 'react'
import { Head, useRouterQuery } from "blitz"
import Navbar from 'app/components/Navbar'
import styled, {createGlobalStyle} from 'styled-components'
import { toast } from 'react-toastify';
import {useStore } from 'app/components/Shared/StoreContext'




const GlobalStyle = createGlobalStyle`
  html,body {
    margin: 0;
    padding: 0;
  }
`;


const Wrapper = styled.div`
  max-width: ${props => props.theme.sizes.maxWidth};
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
`


const Layout = ({ title, children }) =>  {
  const {authError = null} = useRouterQuery()
  const storeState = useStore()

  React.useEffect(() => {
  
    storeState.dispatch({
      type: "SET_ERROR",
      payload: authError
    })

    toast.error(storeState.state.error)
  }, [storeState.state.error])

  return (
    <>
      <Head>
        <title>{title || "gullah"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle />
      <Navbar />
      <Wrapper>
        {children}
      </Wrapper>
      
    </>
  )
}

export default Layout
