import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NewsFeed from "./pages/NewsFeed";
import Subs from "./pages/Subs";
import Post from "./pages/Post";
import OtherProfile from "./pages/OtherProfile";
import AddPost from "./pages/AddPost";
import SubPosts from "./pages/SubPosts";
import {NEWSFEED_ROUTE, SUBS_ROUTE, OTHER_USER_PROFILE_ROUTE, PROFILE_ROUTE, REGISTRATION_ROUTE, LOGIN_ROUTE, POST_ROUTE,ADD_POST_ROUTE,SUB_POSTS_ROUTE} from "./utils/consts";

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
        path: OTHER_USER_PROFILE_ROUTE,
        Component: OtherProfile
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: POST_ROUTE,
        Component: Post
    },
    {
        path: ADD_POST_ROUTE,
        Component: AddPost
    },
    {
        path: SUB_POSTS_ROUTE,
        Component: SubPosts
    },
]

export const PublicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: Auth 
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth 
    },
    
]