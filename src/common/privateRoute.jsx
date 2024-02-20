import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const PrivateRoute = (Children) => {
    const Component = () => {
        const router = useRouter();
        let isAuthenticated = null
        const [loading, setLoading] = useState(true);
        const currentRoute = router.pathname;
        const [finalRoute, setFinalRoute] = useState('');


        const avoidAfterLoginRoutes = ['/', '/login', '/signup', '/mobileLogin', 'verify_link'];

        useEffect(() => {
            if (window != undefined)
                isAuthenticated = localStorage.getItem('token');
            switch (true) {
                case !isAuthenticated && !avoidAfterLoginRoutes.includes(currentRoute):
                    router.replace('/login');
                    setFinalRoute('/login');
                    break;
                case isAuthenticated && avoidAfterLoginRoutes.includes(currentRoute):
                    router.replace('/tournaments');
                    setFinalRoute('/tournaments');
                    break;
                default:
                    setLoading(false);
                    break;
            }
        }, []);
        return <Children />
    }
    //   if (!loading || finalRoute === currentRoute) 
    return Component;
}

export default PrivateRoute;