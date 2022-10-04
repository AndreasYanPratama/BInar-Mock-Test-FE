import { useEffect, useState } from "react";

// private -> perlu login
export function withAuth(WrappedComponent){
    const Content = () => {
        const [show, setShow] = useState(false);
        const [user] = useState(process.browser && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
        
        useEffect(() => {
            if(!user) {
                window.location.href = '/'; // login page
                return false;
            }
            setShow(true);
            return () => {
                setShow(false);
            };
        }, [user]);
        return show ? (
            <WrappedComponent />
        ) : null;
    };

    return Content;
}

// public
export function withNoAuth(WrappedComponent) {
    const Content = () => {
        const [show, setShow] = useState(false);
        const [user] = useState(process.browser && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
        // const [user] = useState(process.window && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);

        useEffect(() => {
            if(user) {
                window.location.href = '/dashboard'; // dashboard
                return false;
            }
            setShow(true);
            return () => {
                setShow(false);
            };
        }, [user]);
        return show ? (
            <WrappedComponent />
        ) : null;
    };

    return Content;
}