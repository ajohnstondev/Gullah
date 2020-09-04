import { Link, BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"

import { useCurrentUser } from "app/hooks/useCurrentUser"


const Home: BlitzPage = () => {
  // const currentUser = useCurrentUser()
  return (
    <div className="container">
      <p>Welcome to Gullah</p>   
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
