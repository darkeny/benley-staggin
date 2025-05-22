import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth';
import { Home } from '../pages/Home';
import NotFound from '../pages/NotFound';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import Loan from '../pages/Loan';
import Contact from '../pages/Contact';
import Panel from '../pages/Panel';
import PrivateRoute from '../components/PrivateRoute';
import ClientPanel from '../pages/Finance';
import { About } from '../pages/About';
import { Services } from '../pages/Services';
import { HowAbout } from '../pages/HowAbout';



const AppRoutes: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path={'/'} element={<Home />} />
                    <Route path={'/signup'} element={<SignUp />} />
                    <Route path={'/signin'} element={<SignIn />} />
                    <Route path={'/about'} element={<About />} />
                    <Route path={'/services'} element={<Services />} />
                    <Route path={'/howabout'} element={<HowAbout />} />
                    <Route path={'/contact'} element={<Contact />} />
                    <Route path={'/loan'} element={<PrivateRoute component={Loan} />} />
                    <Route path={'/panel'} element={<PrivateRoute component={Panel} />} />
                    <Route path={'/mypanel'} element={<PrivateRoute component={ClientPanel} />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
