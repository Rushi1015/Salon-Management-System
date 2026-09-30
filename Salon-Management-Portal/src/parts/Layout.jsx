import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <>
            <div className='row'>
                <Header />
            </div>
            <div className='row main-content'>
                <Outlet />
            </div>
            <div className='row'>
                <Footer />
            </div>
        </>
    )
}

export default Layout
