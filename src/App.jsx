import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/layout/footer'
import Header from './components/layout/header'
import { getAccountAPI } from './services/api.service'
import { AuthContext } from './components/context/auth.context'
import { Spin } from 'antd';



const App = () => {
  const { setUser, isAppLoading, setIsAppLoading } = useContext(AuthContext);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const res = await getAccountAPI();

    if (res.data) {
      //success
      setUser(res.data.user)
    }
    setIsAppLoading(false);
  }

  return (
    <>  
      {isAppLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <Spin />
        </div>
        :
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      }

    </>
  )
}

export default App
