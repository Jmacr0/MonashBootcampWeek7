# Developer Profile Generator 👤
---
## Application

This is a command-line application that dynamically generates a PDF profile from a GitHub username. The application will be invoked with the following command:

```
node index.js
```

The user will be prompted for a favorite color (currently limited to red, blue, and yellow) which will then be used as the main background color.

---

##Process

A html file will be populated with the following information:
* Profile image
* User name
* Links to the following:
  * User location via Google Maps
  * User GitHub profile
  * User blog
* User bio
* Number of public repositories
* Number of followers
* Number of GitHub stars
* Number of users following

A PDF file will then be generated from the html file (currently unavailable)


### User Story

```
AS A product manager

I WANT a developer profile generator

SO THAT I can easily prepare reports for stakeholders
```

### Acceptance Criteria

```
GIVEN the developer has a GitHub profile

WHEN prompted for the developer's GitHub username and favorite color

THEN a PDF profile is generated
```
- - -