import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import PoetryList from '../pages/PoetryList'
import Login from '../pages/Login'
import Register from '../pages/Register'
import PoetryDetail from '../pages/PoetryDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'poetrylist',
        element: <PoetryList />
      },
      {
        path: 'tang-poetry',
        element: <PoetryList />
      },
      {
        path: 'song-poetry',
        element: <PoetryList />
      },
      {
        path: 'yuan-qu',
        element: <PoetryList />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'poetry/:id',
        element: <PoetryDetail />
      }
    ]
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router