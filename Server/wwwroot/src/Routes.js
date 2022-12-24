import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NewsFeed from "./pages/NewsFeed";
import Subs from "./pages/Subs";
import Post from "./pages/Post";
import {NEWSFEED_ROUTE, SUBS_ROUTE, OTHER_USER_PROFILE_ROUTE, PROFILE_ROUTE, REGISTRATION_ROUTE, LOGIN_ROUTE, POST_ROUTE} from "./utils/consts";

export const AuthRoutes = [
    {
        path: NEWSFEED_ROUTE,
        Component: NewsFeed
    },
    {
        path: SUBS_ROUTE,
        Component: Subs
    },
    {
        path: OTHER_USER_PROFILE_ROUTE + '/:user_id',
        Component: Profile //???
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: POST_ROUTE,
        Component: Post
    },

]

export const PublicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: Auth //???
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth //???
    },
    
]