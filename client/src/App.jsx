import '@/styles/index.css'
import { ThemeProvider } from '@/components/theme-provider.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import LoginPage from './pages/login-page'
import ProfilePage from './pages/profile-page'
import AboutUsPage from './pages/about-us'
import UploadPage from '@/pages/upload-bill.jsx'
import BillDetailPage from './pages/bill-details'
import AssignItemsPage from './pages/assign-items'
import DownloadSplitImage from './pages/download-split'


const routes = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/profile",
        element: <ProfilePage />
    },
    {
        path: "/about",
        element: <AboutUsPage />
    },
    {
        path: "/upload-bill",
        element: <UploadPage />
    },
    {
        path: "/bill-details",
        element: <BillDetailPage />
    },
    {
        path: "/assign-items",
        element: <AssignItemsPage />
    },
    {
        path: "/download-split",
        element: <DownloadSplitImage />
    }
])

function App() {

  return (
    <>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <ThemeProvider>
                <RouterProvider router={routes} />
            </ThemeProvider>
        </GoogleOAuthProvider>
    </>
  )
}

export default App
