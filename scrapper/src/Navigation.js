// Navigation.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
function Navigation() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" class="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              class="h-8 mr-3"
              alt="Flowbite Logo"
            />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Amazon Scrapper
            </span>
          </a>
          <button
  onClick={toggleDropdown}
  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-blue-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  aria-controls="navbar-default"
  aria-expanded={isDropdownOpen ? "true" : "false"}
>
  <span className="sr-only">Open main menu</span>
  <svg
    className="w-5 h-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 17 14"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M1 1h15M1 7h15M1 13h15"
    />
  </svg>
</button>

          <div
  className={`${
    isDropdownOpen ? "block" : "hidden"
  } w-full md:block md:w-auto`}
  id="navbar-default"
>
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li className="dark:text-white">
                <Link
                  to="/"
                  class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Home
                </Link>
              </li>
              <li className="dark:text-white">
                <Link
                  to="/scrapper"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Scrapper
                </Link>
              </li>
              <li className="dark:text-white">
                <Link
                  to="/scraphistory"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Scrap History
                </Link>
              </li>
              <li className="dark:text-white">
                <Link
                  to="/account"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>
          {isAuthenticated ? (<LogoutButton/>):(<LoginButton/>)}
        </div>
      </nav>
      


    </>
  );
}

export default Navigation;
