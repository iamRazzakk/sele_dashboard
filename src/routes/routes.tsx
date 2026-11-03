import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/authentication/Login';
import ErrorPage from '../pages/error/ErrorPage';
import ForgetPassword from '../pages/authentication/ForgetPassword';
import VerifyOtp from '../pages/authentication/VerifyOtp';
import NewPassword from '../pages/authentication/NewPassword';
import Earing from '../pages/dashboard/earing/Earing';
import Dashboard from '../pages/dashboard/dasboard/Dashboard';
import PrivacyPolicy from '../pages/dashboard/PrivacyPolicy';
import EditProfile from '../pages/dashboard/profile/EditProfile';
import ChangePassword from '../pages/dashboard/profile/ChangePassword';
import Donate from '../pages/dashboard/donate/Donate';
import TopCommunities from '../pages/dashboard/topCommunities/TopCommunities';
import Events from '../pages/dashboard/events/Events';
import Users from '../pages/dashboard/users/Users';
import Agency from '../pages/dashboard/agency/Agency';
import Profile from '../pages/dashboard/profile/Profle';
import SignUp from '../pages/authentication/SignUp';
import AboutUs from '../pages/dashboard/AboutUs';
import TermsCondition from '../pages/dashboard/TermsCondition';
// import PrivateRoute from './PrivateRoute/PrivateRoute';
import Brand from '../pages/dashboard/brand/Brand';
import Category from '../pages/dashboard/category/Category';
import Policy from '../components/policy/Policy';
import Condition from '../components/policy/TermsCondition';
import AccountDelete from '../components/account-delete/AccountDelete';
import PaymentSuccess from '../payment/PaymentSuucess';
import AccountCreate from '../payment/AccountCreateSuccessfull';
import RequestApproval from '../pages/dashboard/request-approval/RequestApproval';
import PaymentFailed from '../payment/PaymentFailed';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import AccountCreateFailed from '../payment/AccountCreateFailed';
import MarketplaceFees from '../pages/dashboard/marketplace-fees/MarketplaceFees';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <PrivateRoute>
                <App />
            </PrivateRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            { path: '/', element: <Dashboard /> },
            { path: '/users', element: <Users /> },
            { path: '/donate', element: <Donate /> },
            { path: '/events', element: <Events /> },
            { path: '/earing', element: <Earing /> },
            { path: '/agency', element: <Agency /> },
            { path: '/category', element: <Category /> },
            { path: '/request-approval', element: <RequestApproval /> },
            { path: '/brand', element: <Brand /> },

            { path: '/top-communities', element: <TopCommunities /> },
            { path: '/about-us', element: <AboutUs /> },
            { path: '/terms-condition', element: <TermsCondition /> },
            { path: '/terms-policy', element: <PrivacyPolicy /> },

            { path: '/profile', element: <Profile /> },
            { path: '/edit-profile', element: <EditProfile /> },
            { path: '/change-password', element: <ChangePassword /> },
            { path: '/marketplace-fees', element: <MarketplaceFees /> },
        ],
    },
    { path: '/login', element: <Login /> },
    { path: '/sign-up', element: <SignUp /> },
    { path: '/forget-password', element: <ForgetPassword /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/new-password', element: <NewPassword /> },

    { path: '/policy', element: <Policy /> },
    { path: '/condition', element: <Condition /> },
    { path: '/account-delete', element: <AccountDelete /> },
    { path: '/payment-success', element: <PaymentSuccess /> },
    { path: '/payment-failed', element: <PaymentFailed /> },
    { path: '/bank-account-create', element: <AccountCreate /> },
    { path: '/bank-account-create-failed', element: <AccountCreateFailed /> },
]);

export default router;
