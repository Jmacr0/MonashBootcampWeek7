const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const axios = require('axios');
const puppeteer = require('puppeteer');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

function promptQuestions() {
    return inquirer
        .prompt([
            {
                type: "input",
                message: "What is your Github Username?",
                name: "username"
            },
            {
                type: "list",
                message: "What is your favourite colour?",
                name: "favouriteColour",
                choices: [
                    "red",
                    "blue",
                    "yellow"
                ]
            },
        ])
}

async function generateProfile() {
    try {
        let promptedAnswers = await promptQuestions();
        let { username, favouriteColour } = promptedAnswers;
        let githubUser = await axios.get(`https://api.github.com/users/${username}`);
        let {
            data: {
                login,
                avatar_url,
                location, html_url,
                blog,
                bio,
                public_repos,
                followers,
                following
            }
        } = githubUser;

        const { data } = await axios.get(`https://api.github.com/users/${login}/starred`);
        const numOfStars = data.length;
        // const googleMaps = await axios.get(`https://geocoder.api.here.com/6.2/geocode.json?housenumber=425&street=randolph&city=chicago&country=usa&gen=9&app_id=devportal-demo-20180625&app_code=9v2BkviRwi9Ot26kp2IysQc`)
        const template = await readFileAsync('index.base.html', 'utf-8');
        const updateTemplate = template.replace(/username:ph/g, login)
            // .replace("googlemaps:image", `http://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=13&size=600×300&key=AIzaSyAR5vseePdn17I0I7V45wNKAKogdEU6xNc`)
            .replace("[user:locationlink]", `https://www.google.com/maps/search/?api=1&query=${location}`)
            .replace(/favourite-colour/g, favouriteColour)
            .replace("https://via.placeholder.com/150x150", avatar_url)
            .replace("[user:bio]", bio)
            .replace("[user:blog]", blog)
            .replace("[user:github]", html_url)
            .replace("[user:location]", location)
            .replace("[repos:num]", public_repos)
            .replace("[followers:num]", followers)
            .replace("[stars:num]", numOfStars)
            .replace("[following:num]", following)
        // console.log(updateTemplate);
        await writeFileAsync(`index.${login}.html`, updateTemplate, 'utf-8');
        console.log('successful!');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(updateTemplate);
        await page.emulateMedia('print');
        await page.pdf({
            path: `index.${login}.pdf`,
            format: 'A4',
            printBackground: true
        })
        console.log('PDF created!');
        await browser.close();
        process.exit();

    }
    catch (err) {
        console.log(err)
    }
}
generateProfile();


