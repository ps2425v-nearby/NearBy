import {createBrowserRouter} from "react-router-dom";
import Home from "../src/components/Map/Home";
import {Authors} from "@/components/AboutUs/Authors";
import {Register} from "@/components/joinUs/Register/Register";
import {SavedLocations} from "@/components/SavedLocations/SavedLocations";
import {CommentsPreview} from "./components/Comments/Preview/CommentsPreview";
import FilterSearch from "../src/components/FilterSearch/FilterSearch";
import * as React from "react";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/aboutus',
        element: <Authors/>,
    },
    {
        path: '/register',
        element: <Register/>,
    },
    {
        path: '/savedLocations',
        element: <SavedLocations/>,
    },
    {
        path: '/comments',
        element: <CommentsPreview/>,
    },
    {
        path: '/filterSearch',
        element: <FilterSearch/>

    }

]);