import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import axios from "axios";
import Navigation from "./Navigation";
import LineChart from "./components/LineChart";

export default function ScrapHistory() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const [productLinks, setProductLinks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [scrapedData, setscrapedData] = useState([]);

  useEffect(() => {
    if (user) {
      setProfile(user);

      // Check if the user already exists in your API database
      checkUserExists(user.sub);
      if (!userExists) {
        handleGoogleLogin();
      }
    }
  }, [user]);

  const checkUserExists = (googleId) => {
    const apiEndpoint = `http://localhost:443/api/user/google/${googleId}`;

    axios
      .get(apiEndpoint)
      .then((response) => {
        setUserExists(response.data !== null);
      })
      .catch((error) => {
        console.error("Error checking user existence:", error);
      });
  };
  const handleGoogleLogin = async () => {
    try {
      console.log(user.name);
      // After successful login, create or retrieve the user in your MongoDB collection
      const response = await axios.post("http://localhost:443/api/user", {
        googleId: user.sub, // User's Google ID
        displayName: user.name, // User's name
        email: user.email, // User's email
      });

      // Handle the response as needed
      console.log("User data stored in MongoDB:", response.data);
    } catch (error) {
      console.error("Error logging in with Google:", error);
      // Handle login error or display an error message
    }
  };
  // Function to fetch user-related product links by Google ID
  const fetchUserProductLinks = async () => {
    if (profile) {
      const apiEndpoint = `http://localhost:443/api/productlink/user/${profile.sub}`;

      try {
        const response = await axios.get(apiEndpoint);
        setProductLinks(response.data);
      } catch (error) {
        console.error("Error fetching user product links:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch user-related product links when the profile changes
    fetchUserProductLinks();
  }, [profile]);

  const fetchScrapedData = async () => {
    const scrapedDataArray = [];

    for (const data of productLinks) {
      const apiEndpoint = `http://localhost:443/api/scrap/productlink/${data._id}`;

      try {
        const response = await axios.get(apiEndpoint);
        scrapedDataArray.push(...response.data);
      } catch (error) {
        console.error("Error fetching user product links:", error);
      }
    }

    // After all requests are completed, update the state once
    setscrapedData(scrapedDataArray);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  // Assuming scrapedData is your array of scraped data
  const groupedData = scrapedData.reduce((acc, data) => {
    if (!acc[data.name]) {
      acc[data.name] = [];
    }
    acc[data.name].push(data);
    return acc;
  }, {});
  const formattedData = Object.entries(groupedData).map(
    ([productName, products]) => {
      return {
        name: productName,
        entries: products.map((product) => ({
          createdAt: product.createdAt,
          rating: product.rating,
        })),
      };
    }
  );

  console.log(formattedData);
  return (
    <>
      <Navigation />
      <div className="flex flex-col justify-center items-center h-screen bg-sky-900 p-4 text-white">
       
        <h2 className="text-3xl font-sans font-bold mb-4">Scraped Data history</h2>
        {isAuthenticated ? (
          <>
            <p className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">
              If the data is not shown after clicking wait a little and then try
              again
            </p>
            <br/>
            <button class="text-white text-base font-sans bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2" onClick={fetchScrapedData}>
              Show history
            </button>
            <br/>
            <p className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">Scroll down to see the history</p>
          </>
        ) : (
          <p className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">Login to see scrap history</p>
        )}
</div>
<div className="h-full  text-bold text-2xl font-sans text-center bg-gray-300 text-sky-900">
        <LineChart data={formattedData} />
        </div>
        <br/>
        {Object.entries(groupedData).map(([productName, products]) => (
          <>
            <div className="p-5 m-4 text-lg text-center font-semibold font-mono text-blue-700 bg-slate-100 rounded " key={productName}>
              <h3>{productName}</h3>

              {products.map((product, index) => (
                <div key={index}>
                  <p className="text-bold text-red-600">{formatDate(product.createdAt)}</p>
                  <p >{product.reviewCount}</p>
                  <p >{product.rating}</p>
                </div>
              ))}
              <br/>
            </div>
          </>
        ))}
      
    </>
  );
}
