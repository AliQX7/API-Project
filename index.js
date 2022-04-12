const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()



const newspapers = [
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/international',
        base: 'https://www.theguardian.com'
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/russia-ukraine-war',
        base: 'https://www.thetimes.co.uk'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/russia-ukraine-war/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/?s=ukraine',
        base: 'https://www.cityam.com'
    },
    {
        name: 'newyorktimes',
        address: 'https://www.nytimes.com/international/section/world/europe',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/world-nation/story/2022-02-22/full-coverage-russia-ukraine',
        base: 'https://www.latimes.com'
    },
    {
        name: 'thesydneymorningherald',
        address: 'https://www.smh.com.au/world/europe',
        base: 'https://www.smh.com.au'
    },
    {
        name: 'un',
        address: 'https://news.un.org/en/focus/ukraine',
        base: 'https://news.un.org'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/world-60525350',
        base: 'https://www.bbc.com' 
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/ukraine',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/ukraine-war/',
        base: 'https://www.thesun.co.uk'
    },
    {
        name: 'dailymail',
        address: 'https://www.dailymail.co.uk/news/russia-ukraine-conflict/index.html',
        base: 'https://www.dailymail.co.uk'
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/search/ukraine/',
        base: 'https://nypost.com'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $(('a:contains("ukraine")','a:contains("Ukraine")'), html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                if (url.substring(0,5) == "https") {
                    articles.push({
                        title,
                        url: url,
                        source: newspaper.name
                    })
                } else {
                    articles.push({
                        title,
                        url: newspaper.base + url,
                        source: newspaper.name
                    })
                }
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) =>{
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $(('a:contains("ukraine")','a:contains("Ukraine")'), html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                if (url.substring(0,5) == "https") {
                    specificArticles.push({
                        title,
                        url: url,
                        source: newspaperId
                    })
                } else {
                    specificArticles.push({
                        title,
                        url: newspaperBase + url,
                        source: newspaperId
                    })
                }
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))