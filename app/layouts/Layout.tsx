import { Head } from "blitz"

const Layout = ({ title, children }) => (
  <>
    <Head>
      <title>{title || "gullah"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    {children}
  </>
)

export default Layout
