import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Navigation from "./Navigation";

function Scrapper() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const [productLinks, setProductLinks] = useState([]);
  const [link, setLink] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [userschedule, setUserschedule] = useState(null);
  const [change, setChange] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [selectedScheduleOption, setSelectedScheduleOption] = useState(null);
  const [loading, setLoading] = useState(null);
  const [changedScheduleOption, setChangedSelectedScheduleOption] =
    useState(null);
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [url3, setUrl3] = useState("");
  const [url4, setUrl4] = useState("");
  const [url5, setUrl5] = useState("");
  const [scrap, setScrap] = useState([]);
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
    const apiEndpoint = `https://scrapper-backend-k0dl.onrender.com/api/user/google/${googleId}`;

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
      const response = await axios.post("https://scrapper-backend-k0dl.onrender.com/api/user", {
        googleId: user.sub, // User's Google ID
        displayName: user.name, // User's name
        email: user.email, // User's email
      });

      // Handle the response as needed
      console.log("User data stored in MongoDB:", response.data);
      setUserschedule(response.data.schedule);
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error('Error logging in with Google')
    }
  };
  // Function to fetch user-related product links by Google ID
  const fetchUserProductLinks = async () => {
    if (profile) {
      const apiEndpoint = `https://scrapper-backend-k0dl.onrender.com/api/productlink/user/${profile.sub}`;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an array of URLs from separate inputs
    const urls = [url1, url2, url3, url4, url5].filter(
      (url) => url.trim() !== ""
    );

    if (urls.length === 0) {
      console.log("No valid URLs to submit.");
      return;
    }

    const postData = {
      user: profile.sub, // Assuming profile.id contains the user's Google ID
      url: url1,
      url2: url2,
      url3: url3,
      url4: url4,
      url5: url5,
    };

    try {
      const response = await axios.post(
        "https://scrapper-backend-k0dl.onrender.com/api/productlink",
        postData
      );
      console.log("Data posted successfully:", response.data);
      // console.log(response.data._id)
      await scrapData(response.data._id, url1, url2, url3, url4, url5);
      setLink(true);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  const sendEmailToUser = async (googleId, name, email, productLinks) => {
    const userOption = googleId;
    console.log("Data being sent:", {
      userOption,
      name,
      email,
      productLinks,
    });
    try {
      const response = await axios.post("https://scrapper-backend-k0dl.onrender.com/api/schedule", {
        name,
        email,
        productLinks,
        userOption,
      });

      // Handle the response as needed
      console.log("Email sent:", response.data);
      toast.success('Email send successfully')
      setSchedule(true);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error('Error sending email')
      // Handle error or display an error message
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      if (
        (user && user.sub,
        user.name && user.email && productLinks && productLinks.length > 0)
      ) {
        await sendEmailToUser(user.sub, user.name, user.email, productLinks);
        console.log("Email sent successfully");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  const sendChangedSchedule = async (googleId, schedule) => {
    console.log("Data being sent:", {
      schedule,
    });
    try {
      const response = await axios.put(
        `https://scrapper-backend-k0dl.onrender.com/api/user/google/${googleId}`,
        {
          schedule,
        }
      );
      // Handle the response as needed
      console.log("Schedule send:", response.data);
      setChange(true);
    } catch (error) {
      console.error("Error sending schedule:", error);
      // Handle error or display an error message
    }
  };

  const changeSchedule = async (e) => {
    e.preventDefault();
    try {
      if (user && user.sub && changedScheduleOption) {
        await sendChangedSchedule(user.sub, changedScheduleOption);
        console.log("Schedule changed successfully");
      }
    } catch (error) {
      console.error("Error sending changing schedule:", error);
    }
  };
  const scrapData = async (id, ...urls) => {
    console.log(urls);
    try {
      const toastId = toast.loading('Scrapping in progress...');
      const response = await axios.post("http://localhost:5000/review-count", {
        urls,
      });
   
      console.log("Scraped data successfully", response.data);
      toast.dismiss(toastId);
      toast.success('Scraped data successfully')
      setScrap(response.data.results);
      const Scraped = response.data.results;
      try {
        for (const data of Scraped) {
          try {
            // Here, create a ScrapData entry using a POST request
            const response = await axios.post(
              "https://scrapper-backend-k0dl.onrender.com/api/scrap",
              {
                name: data.productName,
                reviewCount: data.reviewCount,
                rating: data.rating,
                productLinkId: id, // Use the product link ID
              }
            );
            console.log("Successfully added scrap data", response.data);
          } catch (error) {
            console.error(error);
          }
        }
        
      } catch (error) {}
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <Toaster   position="top-center"
  reverseOrder={false}/>
      <Navigation />
      <div className="flex flex-col justify-center items-center h-full bg-sky-900 p-4 text-white">
        <br />
        <br />
        {isAuthenticated ? (
          <div className="flex flex-col  justify-center items-center ">
            <h3 className="text-3xl font-sans font-bold mb-4">
              Enter the Product Links
            </h3>
            <br/>
            <form onSubmit={handleSubmit} className="mb-4 rounded bg-gray-700 p-8 font-mono flex flex-col justify-center items-center">
              <div className=" mb-4">
                <label className="text-xl font-semibold">URL 1</label>
                <input
                  type="text"
                  value={url1}
                  onChange={(e) => setUrl1(e.target.value)}
                  className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
                />
              </div>
              <div className=" mb-4">
                <label className="text-xl font-semibold">URL 2</label>
                <input
                  type="text"
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
                />
              </div>
              <div className=" mb-4">
                <label className="text-xl font-semibold">URL 3</label>
                <input
                  type="text"
                  value={url3}
                  onChange={(e) => setUrl3(e.target.value)}
                  className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
                />
              </div>
              <div className=" mb-4">
                <label className="text-xl font-semibold">URL 4</label>
                <input
                  type="text"
                  value={url4}
                  onChange={(e) => setUrl4(e.target.value)}
                  className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
                />
              </div>
              <div className=" mb-4">
                <label className="text-xl font-semibold">URL 5</label>
                <input
                  type="text"
                  value={url5}
                  onChange={(e) => setUrl5(e.target.value)}
                  className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
                />
              </div>
              <button  class="text-white text-base font-sans bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2" type="submit">
                Scrap Review Counts
              </button>
             
            </form>
            <br />
            <br />
            <h3 className="text-3xl font-sans font-bold mb-4">Scraped Data</h3>
            <p className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">Scraped data will be shown here</p>
            <br/>

            <div className="text-lg font-semibold font-mono text-center text-sky-900 bg-slate-100 rounded p-2">
            {scrap?.map((data, index) => (
              <><div  key={index}>
                {" "}
                {/* Use a unique key for each element */}
                <p >Review count: {data.reviewCount}</p>
                <p>Name: {data.productName?.split(",")[0]}</p>
                <p>Rating:{data.rating}⭐</p>
                <br/>
                <hr class="w-48 h-1 mx-auto my-4 bg-sky-900 border-0 rounded md:my-10 dark:bg-gray-700"></hr>
              </div><br /></>
            ))}
            </div>
            <br />
            <br />
            <h3 className="text-2xl font-sans font-bold mb-4">Schedule the email to get the scrapped data</h3>
            <p className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">
              Note - Schedule can be changed from account page
            </p>
            <br/>
            <form onSubmit={sendEmail}>
              <button class="text-white text-base font-sans bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2" type="submit">
                Send Email
              </button>
            </form>
            <br />
            <br />
            <form onSubmit={sendEmail} className="flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">
                If you added new product links after scheduling then reshedule
                to get those links too
              </h3>
              <br/>
              <button class="text-white text-base font-sans bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2" type="submit">
                ReSchedule
              </button>
            </form>
            <br />
            <br />
          </div>
        ) : (
          <>
            <div className="h-screen bg-sky-900">
            <p className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">Login to use the tool</p>
            </div>
           
          </>
        )}
        <br />
        {profile && productLinks.length > 0 && (
          <div className="flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl font-sans font-bold mb-4">User's Product Links history</h3>
            <br />
            <ul className="product-link-list">
              {productLinks.map((link) => (
                <><div className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2" key={link._id}>
                  <li>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url}
                    </a>
                  </li>
                  <li>
                    <a
                      href={link.url2}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url2}
                    </a>
                  </li>
                  <li>
                    <a
                      href={link.url3}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url3}
                    </a>
                  </li>
                  <li>
                    <a
                      href={link.url4}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url4}
                    </a>
                  </li>
                  <li>
                    <a
                      href={link.url5}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url5}
                    </a>
                    <br />
                    <button
                      class="text-white font-sans  bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-base px-5 py-2.5 text-center mr-2 mb-2"
                      onClick={() => scrapData(
                        link._id,
                        link.url,
                        link.url2,
                        link.url3,
                        link.url4,
                        link.url5
                      )}
                    >
                      Scrap
                    </button>
                  </li>
                  <p>ID: {link._id}</p>
                </div><br /></>
              ))}
            </ul>
          </div>
        )}
      </div>
      <></>
    </>
  );
}

export default Scrapper;
