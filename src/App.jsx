// 路由
import './App.css'
import { RouterProvider } from 'react-router-dom' //這裡引入元件
import {route} from './router' //引入我們設定的路由表

export default function App() {
  return (
    <>
      <RouterProvider router={route}></RouterProvider>
    </>
  )
}

