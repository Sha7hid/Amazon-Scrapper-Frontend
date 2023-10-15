import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import axios from "axios";
import Navigation from "./Navigation";
import toast, { Toaster } from 'react-hot-toast';

function Home() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const [productLinks, setProductLinks] = useState([]);
  const [email2, setEmail2] = useState(false);
  const [email3, setEmail3] = useState(false);
  const [userschedule, setUserschedule] = useState(null);
  const [change, setChange] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [selectedScheduleOption, setSelectedScheduleOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changedScheduleOption, setChangedSelectedScheduleOption] =
    useState(null);

  const [emailData, setEmailData] = useState({
    email1: "",
    email2: "",
    email3: "",
  });
  

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
      setEmail2(response.data.email2)
      setEmail3(response.data.email3)
    } catch (error) {
      console.error("Error logging in with Google:", error);
      // Handle login error or display an error message
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
      toast.success("Schedule changed successfully")
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Send the email data to the route using Axios or fetch
    try {
      const response = await axios.put(`https://scrapper-backend-k0dl.onrender.com/api/user/google/${user.sub}`, {
        ...emailData, // Include the email data from the state
      });
  console.log(emailData)
      // Handle the response as needed
      console.log("Email data sent successfully:", response.data);
  toast.success('Emails added successfully')
    } catch (error) {
      console.error("Error sending email data:", error);
      // Handle error or display an error message
    }
  };
    

  return (
    <>
    <Toaster  position="top-center"
  reverseOrder={false}/>
            <Navigation />
      <div  className="flex flex-col justify-center items-center h-screen bg-sky-900 p-4 text-white">
        <br />
        <br />
        {isAuthenticated ? (
          <div className=" flex flex-col text-center items-center h-full bg-sky-900 p-4 text-white">
            {profile ? (
              <>
                <div className="flex flex-col gap-3 justify-center items-center bg-slate-100 text-sky-900 p-5 rounded-md border-blue-600 border-4">
                  <div >
                  <img
                    src={profile.picture}
                    alt="user image"
                    className="rounded-full "
                  />
                  </div>
                 
                  <h3 className="text-lg font-bold">User Logged in</h3>
                  <p className="font-bold font-mono">User Id:{profile.sub}</p>
                  <p className="font-bold font-mono">Name: {profile.name}</p>
                  <p className="font-bold font-mono">Email Address: {profile.email}</p>
                  <p className="font-bold font-mono">Second Email Address: {email2}</p>
                  <p className="font-bold font-mono">Third Email Address: {email3}</p>
                  <p className="font-bold font-mono">Current User Schedule: {userschedule}</p>
                  <br />
                  <br />
                </div>
              </>
            ) : (
              <p></p>
            )}
<br/>
            {/* change schedule */}
            <form onSubmit={changeSchedule} className="mb-4 rounded bg-gray-700 p-8 font-mono flex flex-col justify-center items-center">
              <h3 className="text-xl font-sans font-bold">Add or change existing schedule</h3>
              <br/>
              <div className="form-group">
                <label class="block mb-2 text-sm font-sans font-medium text-white dark:text-white">Select Schedule Option:</label>
                <select
                  value={changedScheduleOption}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) =>
                    setChangedSelectedScheduleOption(e.target.value)
                  }
                >
                  <option value="">Select a schedule option</option>
                  <option value="2 minutes">2 minutes</option>
                  <option value="1 week">1 week</option>
                  <option value="15 days">15 days</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                </select>
              </div>
              <br/>
              <button  class="text-white text-base font-sans bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2" type="submit">
                Set Schedule
              </button>
            </form>
            <form onSubmit={handleSubmit} className="mb-4 rounded bg-gray-700 p-12 font-mono flex flex-col justify-center items-center">
            <h3 className="text-2xl font-sans font-bold mb-6">Update or Add new emails</h3>
  <div className="mb-4 text-white text-left">
    <label htmlFor="email1" className="text-lg font-semibold ">Email 1</label>
    <input
      type="text"
      id="email1"
      name="email1"
      value={emailData.email1}
      onChange={handleInputChange}
      className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
    />
  </div>
  <div className="mb-4 text-white text-left">
    <label htmlFor="email2" className=" text-lg font-semibold ">Email 2</label>
    <input
      type="text"
      id="email2"
      name="email2"
      value={emailData.email2}
      onChange={handleInputChange}
      className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
    />
  </div>
  <div className="mb-4 text-white text-left">
    <label htmlFor="email3" className="text-lg font-semibold ">Email 3</label>
    <input
      type="text"
      id="email3"
      name="email3"
      value={emailData.email3}
      onChange={handleInputChange}
      className="border-solid border-4  text-red-700 border-blue-700 outline-4 outline-blue-500 rounded px-2 py-1 w-full "
    />
  </div>
  <button class="text-white text-base font-sans bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2" type="submit">Submit</button>
</form>

          </div>
        ) : (
         <p className="text-lg font-semibold font-mono text-blue-700 bg-slate-100 rounded p-2">Login to see account details</p>
        )}
      </div>
    </>
  );
}

export default Home;
