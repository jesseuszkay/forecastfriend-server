## How to use ForecastFriend

Download a clone of this repository and the forecastfriend-client repository.

Run "npm install" to download all dependencies on the client and server sides.

Run "npm run dev" on the server and then the client.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## About the design process of ForecastFriend

About the front-end:

I had never used Typescript, Next.js, or Tailwind before, so to get started on the project I followed the beginning YouTube tutorial for a different type of project, which gave me a good starting off point for the basic look of the app. By the end of this project very few elements remain of that initial design, however it helped me quickly learn how to use these new technologies.

I wanted to keep a simple clean look, as I believe users of an app like this would want to see the weather information they are looking for as quickly as possible without distraction. I wanted the pops of color on the site to be weather condition images, and since the API had weather conditions included I figured I might as well make that a part of the app. The primary focus of the app is to tell you the current weather, so I made that front and center on the page, and the historical weather featured right below. I added the "View Saved Snapshots" button in the Nav Bar, as this would be where a user typically looks for information specific to their user profile.

Some additions I would make if I were to continue working on this app would be to add an API such that the user could search for a city/their location rather than having to type in their latitude and longitude. Since this app also seems to be about looking at weather conditions over time, it could also be interesting to add temperature data from the same day in previous years.

I found it interesting to learn about Next.js and server-side rendering although I did not utilize it that much, but for a more complex project I would definitely consider using it again. Tailwind did add some convenience to styling, to be able to quickly pop in a style on the .tsx file without having to switch to a styling page, however I think I do prefer keeping all styles in a seperate sheet for more long-term projects to keep things more organized. Typescript did not really change much for me, I do see the benefits although it did cause me to run into more errors as I was learning.

About the back-end:

I didn't want the back-end to get too complex for such a simple app, so I decided to try using SQLite as opposed to building a separate MySQL database as I have done before. I wanted to add something with a bit more scalability and sophistication than a .json file, but since I was not going to deploy the app or database this seemed like a good in-between solution. SQLite was very easy to set up, and I did do a test downloading the clone of the repo myself to make sure it would work, so I believe this was a good choice. I have quite a bit of experience now with Node.js, Express, and Axios so that part of the project was quite straightforward for me.
