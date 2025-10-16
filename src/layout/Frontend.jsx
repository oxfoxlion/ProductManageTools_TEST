import { Outlet } from "react-router-dom"

import Header from "../component/Header"
export default function Frontend() {
    return (
        <>
            <div className="min-h-screen bg-gray-300">
                <Header></Header>
                <Outlet></Outlet>
            </div>

        </>)
}