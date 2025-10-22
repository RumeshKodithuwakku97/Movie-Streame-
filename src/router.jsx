import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AdminApp from './AdminApp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminApp />,
  },
]);

export default router;