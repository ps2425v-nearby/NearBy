import { createBrowserRouter } from "react-router-dom";
import Home from "../src/components/Map/Home";
import { Authors } from "@/components/AboutUs/Authors";
import { Register } from "@/components/joinUs/Register/Register";
import { SavedLocations } from "@/components/SavedLocations/SavedLocations";
import { CommentsPreview } from "./components/Comments/Preview/CommentsPreview";
import FilterSearch from "../src/components/FilterSearch/FilterSearch";
import * as React from "react";

/**
 * Defines the main routes of the application using React Router.
 *
 * Each route object includes:
 * - `path`: the URL path
 * - `element`: the React component to render at that path
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />, // Main map/home page
    },
    {
        path: '/aboutus',
        element: <Authors />, // "About Us" page showing the team
    },
    {
        path: '/register',
        element: <Register />, // User registration page
    },
    {
        path: '/savedLocations',
        element: <SavedLocations />, // Page showing user's saved locations
    },
    {
        path: '/comments',
        element: <CommentsPreview />, // Comment preview section
    },
    {
        path: '/filterSearch',
        element: <FilterSearch /> // Search page with filters
    }
]);
