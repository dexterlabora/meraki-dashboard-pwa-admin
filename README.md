# Meraki Dashboard Vue PWA

## The Technician App

A VueJS progressive web app for exploring and building Meraki network management tools.

[Live Demo](https://create.meraki.io/build/dashboard-admin-app-demo/)

## Overview

This app provides a convenient way to interact with the Cisco Meraki APIs for demonstration purposes or use it to solve real problems. It is built upon the VueJS framework with several additional services to help streamline the development process. The goal of this project is to allow you to focus on the core task without writing a ton of boilerplate code or allow you to simply kick the tires of the Meraki API.

## Use Cases

- Demonstrate the power of Meraki APIs
- Restricted access: “manager” vs “technician” tools
- Quickly build custom tools for real-world requirements

## Features

- Local Storage for API key and state of app
- Admin Mode
- Client List, policy assignment, details
- Device List
- Inventory List
- Organization and Network selector
- Wireless SSID management
- PII for GDPR
- Traffic Analysis

# Getting Started

## Pre-requisites

- [Meraki Dashboard API Key](https://create.meraki.io/guides/dashboard-api/)
- [NodeJS](https://nodejs.org/en/)

## Configuration

Update the `\config\merakiConfigs.js` file with our Meraki API key.

```js
module.exports = {
  apiKey: "2f301bccd61b6cYourAPIkey76e5eb66ebd170f",
  apiUrl: "https://api.meraki.com/api/v0"
};
```

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080 and proxy API calls to backend
# serve backend proxy server at locahost:8088
npm run dev

# build for production with minification, required for Heroku deploy and local API tests
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# server production build, Heroku compatible. App will run on localhost:8088
npm run web
```

# Development

### Environment

- [VueJS](https://vuejs.org/) JS Framework
- [Vuetify](https://vuetifyjs.com/en/) Component Framework
- [NodeJS](https://nodejs.org/en/) Web server
- [Meraki-Service](https://github.com/dexterlabora/meraki-service) Meraki API helper service
  - [Docs](https://dexterlabora.github.io/meraki-service/)
- [Webpack](http://vuejs-templates.github.io/webpack/) Dev hot-reload,production tools, etc.

## Backend

The application uses a NodeJS server to host the application and handle all of the Meraki API calls. It will use the configured API key by default but will accept a user supplied key as an override.

## Frontend

The frontend uses VueJS to deliver an interactive progressive web app. Each component within the `src/components` directory will display an HTML template which is controlled by the local script. This is where you will find the various features and build new tools.

The Vuetify library allows for quick tool creation by selecting from a range of pre-built styles and components.

### Components

The Vue components provide the individual tools.

### To Do

- Authentication & improved security
- Improved aesthetics
- Custom Tools section
- BLE integration
- Barcode scanner
- Cleanup / standardize components
- Implement proper logging/debugging. Currently using `console.log`
- Implement tests

### Created by Cory Guynn

I built this to explore Meraki APIs and at the same time experiment with VueJS. The project has been an organic creation so apologies for any inconsistencies and uncessary stuff.

www.Meraki.io

### LICENSE
Apache 2.0 (see [LICENSE](./LICENSE) and [NOTICE](./NOTICE)).
