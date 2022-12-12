const express = require('express')
const weatherRouter = express.Router()
const request = require('request')
const API_KEY_OPENWEATHERMAP = process.env.API_KEY_OPENWEATHERMAP
const API_URI_OPENWEATHERMAP = process.env.API_URI_OPENWEATHERMAP
const API_KEY_YELP = process.env.API_KEY_YELP
const API_URI_YELP = process.env.API_URI_YELP

// http://localhost:3000/api/weather/?cities=3181528,3173435,3169070,3165525,3173721

weatherRouter.get('/', (req, res) => {
    const { cities } = req.query
    request(`${API_URI_OPENWEATHERMAP}${cities}&appid=${API_KEY_OPENWEATHERMAP}`, (err, response, body) => {
        if (err)
            res.send(400).send(err)
        const citiesInfos = JSON.parse(body).list.reduce((obj, city) => {
            const {
                sys: { country },
                weather: [{ description: weather }],
                name
            } = city;
            obj[name] = {
                country,
                weather
            };
            return obj;
        }, {});

        const citiesPromises = Object.keys(citiesInfos).map(city => {
            return new Promise((resolve, reject) => {
                request({ url: `${API_URI_YELP}${city}`, headers: { Authorization: `Bearer ${API_KEY_YELP}` } }, (err, response, body) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const businesses = JSON.parse(body).businesses.map(business => {
                        const {
                            is_closed,
                            rating,
                            name
                        } = business
                        return {
                            name,
                            rating,
                            'closed': is_closed
                        }
                    });
                    citiesInfos[city] = { ...citiesInfos[city], businesses };
                    resolve();
                });
            });
        });

        Promise.all(citiesPromises).then(() => {
            res.send(citiesInfos);
        }).catch((err) => {
            res.send(400).send(err);
        });

    })
})



module.exports = weatherRouter
