const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { title } = require('process')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))
//console.log(__filename)

const app = express()

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath =  path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handbars engine and views location
app.set('views', viewsPath)
app.set('view engine', 'hbs')
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Abhay'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: "Abhay Yadav"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'this is some more helpful text',
        title: 'Help',
        name: 'Abhay Singh'
    })
})
// app.get('', (req, res) => {
//     res.send('<h1>Hello Express !!</h1>')
// })

// app.get('/help', (req, res) => {
//     res.send([{
//         name:'Abhay'
//     },{
//         name:'Amit'
//     }])
// })

// // challenge part
// app.get('/about', (req, res) => {
//     res.send("<h1>About the page</h1>")
// })

app.get('/weather', (req, res) => {

    if(!req.query.address){
        return res.send({
            error: 'You must provide the address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    // res.send({
    //     location: 'Kanpur',
    //     forecast: 'It is cloudy',
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) => {
   
    if(!req.query.search){
       return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Abhay Singh Yadav',
        errorMessage: 'Help article not found'
    })
    //res.send('Help article not found!!')
})

// for everything which is not above
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Abhay Yadav',
        errorMessage: 'Page not found.'
    })
   // res.send('My 404 Page')
})

// app.com
// app.com/help
app.listen(3000, () => {
    console.log('Server is up!')
})