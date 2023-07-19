const express = require('express')
var router = express.Router();
const axios = require("axios");

const app = express()
const port = 5000

const apiUrl = "http://20.244.56.144/train/trains";
let authToken = "";
let tokenExpirationTime = 0;

// register with john doe railway server using postman
// {
//   "companyName": "Train Service Port",
//   "clientID": "c4e39e37-ef66-48d8-b697-a4d44df9bde0",
//   "clientSecret": "uKeklvsHwabufMjY",
//   "ownerName": "Khushi Arora",
//   "ownerEmail": "akhushi72@gmail.com",
//   "rollNo": "2K20CSUN01058"
// }


//authorization token from john doe railway server
const generateAccessToken = async () => {
  const authApiUrl = "http://20.244.56.144/train/auth";
  const credentials = {
    "companyName": "Train Service Port",
    "clientID": "c4e39e37-ef66-48d8-b697-a4d44df9bde0",
    "clientSecret": "uKeklvsHwabufMjY",
    "ownerName": "Khushi Arora",
    "ownerEmail": "akhushi72@gmail.com",
    "rollNo": "2K20CSUN01058"
  };


  // data recieved after authrization

//   {
//     "token_type": "Bearer",
//     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODk3NzY5NDQsImNvbXBhbnlOYW1lIjoiVHJhaW4gU2VydmljZSBQb3J0IiwiY2xpZW50SUQiOiJjNGUzOWUzNy1lZjY2LTQ4ZDgtYjY5Ny1hNGQ0NGRmOWJkZTAiLCJvd25lck5hbWUiOiIiLCJvd25lckVtYWlsIjoiIiwicm9sbE5vIjoiMksyMENTVU4wMTA1OCJ9.KCUNFpx7MD8NAkvoFsexx6LYJypkFEsYiM4in4PQHPU",
//     "expires_in": 1689776944
// }

  try {
    const response = await axios.post(authApiUrl, credentials);
    authToken = response.data.access_token;
    tokenExpirationTime = response.data.expires_in;
    setTimeout(generateAccessToken, (tokenExpirationTime - Math.floor(Date.now() / 1000)) * 1000);
  } catch (error) {
    console.error("Error generating access token:", error);
  }
};


const sortTrains = (trains) => {
  // console.log(trainData)
  // Filter trains departing in the next 30 minutes
  const filteredTrains = trains.filter((train) => {
    const currentTimestamp = new Date().getTime();
    const departureTimestamp = new Date().setHours(
      train.departureTime.Hours,
      train.departureTime.Minutes,
      train.departureTime.Seconds
    );
    return departureTimestamp - currentTimestamp > 30 * 60 * 1000;
  });

  // Sort trains based on conditions
  const sortedTrains = filteredTrains.sort((a, b) => {
    // Sort by price (ascending order)
    const priceA = a.price.sleeper;
    const priceB = b.price.sleeper;
    if (priceA !== priceB) {
      return priceA - priceB;
    }

    // Sort by tickets (descending order)
    const ticketsA = a.seatsAvailable.sleeper;
    const ticketsB = b.seatsAvailable.sleeper;
    if (ticketsA !== ticketsB) {
      return ticketsB - ticketsA;
    }

    // Sort by departure time (descending order)
    const departureTimeA = new Date().setHours(
      a.departureTime.Hours,
      a.departureTime.Minutes,
      a.departureTime.Seconds
    );
    const departureTimeB = new Date().setHours(
      b.departureTime.Hours,
      b.departureTime.Minutes,
      b.departureTime.Seconds
    );
    return departureTimeB - departureTimeA;
  });

  return sortedTrains;
};


app.get("/", async function (req, res, next) {
  if (!authToken || Math.floor(Date.now() / 1000) >= tokenExpirationTime) {
   
    await generateAccessToken();
  }

 

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching train data:", error);
    res.status(500).json({ error: "Error fetching train data" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
