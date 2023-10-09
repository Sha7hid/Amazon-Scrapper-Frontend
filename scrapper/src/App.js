import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
  const [productLinks, setProductLinks] = useState([]);
  const [link, setLink] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [userschedule, setUserschedule] = useState(null);
  const [change, setChange] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [selectedScheduleOption, setSelectedScheduleOption] = useState(null);
  const [changedScheduleOption, setChangedSelectedScheduleOption] = useState(null);
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [url3, setUrl3] = useState("");

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
      setUserschedule(response.data.schedule);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an array of URLs from separate inputs
    const urls = [url1, url2, url3].filter((url) => url.trim() !== "");

    if (urls.length === 0) {
      console.log("No valid URLs to submit.");
      return;
    }

    const postData = {
      user: profile.sub, // Assuming profile.id contains the user's Google ID
      url: url1,
      url2: url2,
      url3: url3,
    };

    try {
      const response = await axios.post(
        "http://localhost:443/api/productlink",
        postData
      );
      console.log("Data posted successfully:", response.data);
      setLink(true)
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  const sendEmailToUser = async (
    googleId,
    name,
    email,
    productLinks
  ) => {
    const userOption = googleId; 
    console.log('Data being sent:', {
      userOption,
      name,
      email,
      productLinks
    });
    try {
      const response = await axios.post("http://localhost:443/schedule-email", {
        name,
        email,
        productLinks,
        userOption
      });

      // Handle the response as needed
      console.log("Email sent:", response.data);
      setSchedule(true)
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle error or display an error message
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault()
    try {
      if (
        user &&
        user.sub,
        user.name &&
        user.email &&
        productLinks &&
        productLinks.length > 0 
      ) {
        await sendEmailToUser(
          user.sub,
          user.name,
          user.email,
          productLinks
        );
        console.log("Email sent successfully");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  const sendChangedSchedule = async (
   googleId,
   schedule
  ) => {
    console.log('Data being sent:', {
     schedule
    });
    try {
      const response = await axios.put(`http://localhost:443/api/user/google/${googleId}`, {
      schedule,
      });
      // Handle the response as needed
      console.log("Schedule send:", response.data);
      setChange(true)
    } catch (error) {
      console.error("Error sending schedule:", error);
      // Handle error or display an error message
    }
  };

  const changeSchedule = async (e) => {
    e.preventDefault()
    try {
      if (
        user &&
        user.sub &&
        changedScheduleOption
      ) {
        await sendChangedSchedule(
        user.sub,
        changedScheduleOption
        );
        console.log("Schedule changed successfully");
      }
    } catch (error) {
      console.error("Error sending changing schedule:", error);
    }
  };

  return (
    <div className="App">
      <h2>Amazon Scrapper Tool</h2>
      <br />
      <br />
      {isAuthenticated ? (
        <div className="login">
          {profile ? (
            <>
              <div className="user-info">
                <img
                  src={profile.picture}
                  alt="user image"
                  className="user-image"
                />
                <h3>User Logged in</h3>
                <p>Name: {profile.name}</p>
                <p>Email Address: {profile.email}</p>
                <p>Current User Schedule: {userschedule}</p>
                <br />
                <br />
              </div>
            </>
          ) : (
            <p></p>
          )}

          <h3>Enter the Product Links</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>URL 1:</label>
              <input
                type="text"
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>URL 2:</label>
              <input
                type="text"
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>URL 3:</label>
              <input
                type="text"
                value={url3}
                onChange={(e) => setUrl3(e.target.value)}
              />
            </div>
            <button className="button" type="submit">Submit URLs</button>
            {link? <p className="success">Submitted Successfully!! Refresh to see the updated Product Links history</p>:<p></p>}
          </form>
          <br />
          <br />
          {/* change schedule */}
          <form onSubmit={changeSchedule}>
            <h3>Add or change existing schedule</h3>
            <div className="form-group">
              <label>Select Schedule Option:</label>
              <select
                value={changedScheduleOption}
                onChange={(e) => setChangedSelectedScheduleOption(e.target.value)}
              >
                <option value="">Select a schedule option</option>
                <option value="2 minutes">2 minutes</option>
                <option value="1 week">1 week</option>
                <option value="15 days">15 days</option>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
              </select>
            </div>
            <button className="button" type="submit">Set Schedule</button>
            {change? <p className="success">Scheduled Successfully! Confirm to start the schedule</p>:<p></p>}
          </form>
          <br />
          <form onSubmit={sendEmail}>
  <button className="button" type="submit">Confirm Schedule</button>
  {schedule? <p className="success">Scheduled Email Successfully!! Check your inbox on time📧</p>:<p></p>}
</form>
<br />
          <form onSubmit={sendEmail}>
            <h3>If you added new product links after scheduling then reshedule to get those links too</h3>
  <button className="button" type="submit">ReSchedule</button>
  {schedule? <p className="success">ReScheduled Email Successfully!! Check your inbox on time📧</p>:<p></p>}
</form>
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
      {profile && productLinks.length > 0 && (
        <div className="product-links">
          <h3>User's Product Links history</h3>
          <ul className="product-link-list">
            {productLinks.map((link) => (
              <div className="product-link" key={link._id}>
                <li>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </li>
                <li>
                  <a href={link.url2} target="_blank" rel="noopener noreferrer">
                    {link.url2}
                  </a>
                </li>
                <li>
                  <a href={link.url3} target="_blank" rel="noopener noreferrer">
                    {link.url3}
                  </a>
                </li>
                <p>ID: {link._id}</p>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;