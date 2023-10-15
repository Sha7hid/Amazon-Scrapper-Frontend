import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";

function Home() {
  const { isAuthenticated, user } = useAuth0();

  return (
    <><Navigation /><>

      <div className="flex justify-center  items-start bg-sky-900 h-screen p-4 text-white">
       <div className="text-center">
        <h1 className="mt-2 mb-6 text-4xl font-extrabold leading-none tracking-tight md:text-3xl lg:text-5xl">
          How Scrapper Works
        </h1>
        <ul className="list-none bg-white p-4 rounded-lg shadow-lg text-sky-900">
  <li className="mb-4 text-lg">
    <span className="text-xl font-bold">▶️ Login:</span><span className="font-semibold"> Login with email and password or continue with Google</span>
  </li>
  <li className="mb-4 text-lg">
    <span className="text-xl font-bold">▶️ Scrapper Page:</span><span className="font-semibold"> Go to Scrapper page -{" "}</span>
    <Link
      to="/scrapper"
      className="text-blue-500 hover:underline"
    >
      Scrapper
    </Link>
  </li>
  <li className="mb-4 text-lg">
    <span className="text-xl font-bold">▶️ Enter Product Links:</span><span className="font-semibold"> Enter the product links and click the scrap button to view scraped data</span>
  </li>
  <li className="mb-4 text-lg">
    <span className="text-xl font-bold">▶️ Product Link Format:  </span> 
    <span className="text-blue-500">
      https://www.amazon.com/ASUS-IPS-Type-GeForce-Gigabit-FA506IH-AS53/dp/B0865THZCL/ref=sr_1_6?keywords=laptop&qid=1697173039&refinements=p_n_feature_twenty_browse-bin%3A76501098011&rnid=76501006011&s=pc&sr=1-6
    </span>
  </li>
  <li className="mb-4 text-lg">
    <span className="text-xl font-bold">▶️ Schedule:</span><span className="font-semibold"> You can schedule the scraper function to run at specific times</span>
  </li>
  <li className="mb-4 text-lg">
    <span className="text-xl font-bold">▶️ Change Schedule:</span><span className="font-semibold"> You can change the schedule in the Account page -{" "}</span>
    <Link
      to="/account"
      className="text-blue-500 hover:underline"
    >
      Account
    </Link>
  </li>
  <li className="mb-4 text-lg">
    <span className="text-xl font-bold">▶️ View Scraped Data:  </span><span className="font-semibold">You can view the scraped data history and visualize it in a chart -{" "}</span> 
    <Link
      to="/scraphistory"
      className="text-blue-500 hover:underline"
    >
      Scrap History
    </Link>
  </li>
</ul>


        </div>
      </div>
    </></>
 
  );
}

export default Home;

