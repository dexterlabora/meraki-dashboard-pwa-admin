
/* Meraki Dashboard API endpoint service

A collection of functions to interact with the Meraki API. 

Install:
npm install axios json-bigint --save

Use (VueJS example):

//main.js
import MerakiService from "./services/meraki-service.class";
Vue.prototype.$meraki  = new MerakiService(apikey, baseUrl);

// componentXYZ
onGetClientsForNetwork() {
      this.$meraki.getClientsForNetwork(this.netId, 86400).then(res => {
        this.clients = res;
      });
    }

*/


const axios = require("axios");
const JSONbig = require("json-bigint");

// Meraki Error Handler (parses the error message within responses)
function _handleError(e) {
  console.log("error in Meraki API call: ", e);
  if (e.message) { e = e.message }
  if (e.response) {
    if (e.response.data) {
      // Meraki specific error message
      if (e.response.data.errors) {
        console.log(e.response.data.errors[0]);
        e = e.response.data.errors[0];
      }
    } else {
      console.log(e.response)
      e = e.response;
    }
  } else {
    console.log(e);
  }
  return e;
}


export default class merakiService {

  constructor(apiKey, baseUrl, eventHub) {
    this._apiKey = apiKey;
    this._baseUrl = baseUrl;
    this._eventHub = eventHub;

    this.initMeraki();
  }

  // *************
  // Intialize API 
  // *************

  initMeraki() {
    this.meraki = axios.create({
      baseURL: this._baseUrl,
      headers: { 'X-Cisco-Meraki-API-Key': this._apiKey }
    });

    this.meraki.interceptors.request.use((config) => {
      this._eventHub.$emit('meraki-loading', true);
      return config;
    });

    this.meraki.interceptors.response.use(
      res => {
        this._eventHub.$emit('meraki-loading', false);
        //console.log('interceptor response', res)
        if (res.config.method == 'put') {
          this._eventHub.$emit('meraki-success-put', "Network Updated");
        }
        if (res.config.method == 'post') {
          this._eventHub.$emit('meraki-success-post', "Network Updated");
        }
        if (res.config.method == 'delete') {
          this._eventHub.$emit('meraki-success-delete', "Network Updated");
        }

        return res;
      },
      error => {
        this._eventHub.$emit('meraki-error', _handleError(error));
        return _handleError(error);
      }
    );

  }

  // *********
  // Getters & Setters for Global API Settings
  // *********


  get apiKey() {
    return this._apiKey;
  }

  set apiKey(apiKey) {
    this._apiKey = apiKey;
    this.initMeraki();
  }

  get baseUrl() {
    return this._baseUrl;
  }

  set baseUrl(baseUrl) {
    this._baseUrl = baseUrl;
    this.initMeraki();
  }

  get loading() {
    return this._loading;
  }
  // ********
  // Organizations
  // ********

  // GET Organizations
  async getOrganizations() {
    let data = await this.meraki.get('/organizations', { transformResponse: [data => data] })
      .then(res => { return JSONbig.parse(res.data) });
    return data;
  }

  // GET Inventory for an organization
  async getInventory(orgId) {
    return await this.meraki.get('/organizations/' + orgId + '/inventory').then((res) => { return res.data });
  }

  // GET Licenses for an organization
  async getLicenseState(orgId) {
    return await this.meraki.get('/organizations/' + orgId + '/licenseState').then((res) => { return res.data });
  }


  // ********
  // Networks
  // ********

  // GET Networks for an organization
  async getNetwork(netId) {
    return await this.meraki.get('/networks/' + netId).then((res) => { return res.data });
  }

  // GET Networks for an organization
  async getNetworks(orgId) {
    return await this.meraki.get('/organizations/' + orgId + '/networks').then((res) => { return res.data });
  }

  // GET Networks for an organization
  async createNetwork(orgId, data) {
    return await this.meraki.post('/organizations/' + orgId + '/networks', data).then((res) => { return res.data });
  }

  // GET Networks for an organization
  async deleteNetwork(netId) {
    return await this.meraki.delete('/networks/' + netId).then((res) => { return res.data });
  }

  // GET SSIDs for an organization
  async getSsids(netId) {
    return await this.meraki.get('/networks/' + netId + '/ssids').then((res) => { return res.data });
  }

  // GET SSIDs for an organization
  async getSsid(netId, ssidNum) {
    return await this.meraki.get('/networks/' + netId + '/ssids/' + ssidNum).then((res) => { return res.data });
  }

  // PUT Update SSID
  async updateSsid(netId, number, data) {
    return await this.meraki.put('/networks/' + netId + '/ssids/' + number, data).then((res) => { return res.data });
  }

  // GET Networks for an organization
  async getOrgDevices(orgId) {
    return await this.meraki.get('/organizations/' + orgId + '/deviceStatuses').then((res) => { return res.data });
  }

  // GET Group Policies for a Network
  async getPolicies(netId) {
    return await this.meraki.get('/networks/' + netId + '/groupPolicies').then((res) => { return res.data });
  }

  // GET Traffic for a network
  async getTraffic(netId, timespan) {
    return await this.meraki.get('/networks/' + netId + '/traffic?timespan=' + timespan).then((res) => { return res.data });
  }

  // GET Devices for a network
  async getDevices(netId) {
    return await this.meraki.get('/networks/' + netId + '/devices').then((res) => { return res.data });
  }

  // GET a single Device in a network
  async getDevice(netId, serial) {
    return await this.meraki.get('/networks/' + netId + '/devices/' + serial).then((res) => { return res.data });
  }

  // GET Cliets for a Meraki device serial for a given timespan in seconds
  async getClients(serial, timespan) {
    return await this.meraki.get('/devices/' + serial + '/clients?timespan=' + timespan).then((res) => { return res.data });
  }

  // GET Policies for a Client in a Network
  async getClientPolicy(netId, clientMac, timespan) {
    return await this.meraki.get('/networks/' + netId + '/clients/' + clientMac + '/policy?timespan=' + timespan).then((res) => { return res.data });
  }

  // PUT Policies for a Client in a Network
  async updateClientPolicy(netId, clientMac, timespan, data) {
    return await this.meraki.put('/networks/' + netId + '/clients/' + clientMac + '/policy?timespan=' + timespan, data).then((res) => { return res.data });
  }
  // *********
  // Templates
  // *********

  // GET Config templates for an organization
  async getConfigTemplates(orgId) {
    return await this.meraki.get('/organizations/' + orgId + '/configTemplates').then((res) => { return res.data });
  }

  // DELETE a Configuration Template
  async removeConfigTemplate(orgId, templateId) {
    return await this.meraki.delete('/organizations/' + orgId + '/configTemplates/' + templateId).then((res) => { return res.data });
  }

  // POST bind Network to Template
  async bindTemplate(netId, data) {
    return await this.meraki.post('/networks/' + netId + '/bind', data).then((res) => { return res.data });
  }

  // POST unbind Network from Template
  async unbindTemplate(netId, data) {
    return await this.meraki.post('/networks/' + netId + '/unbind', data).then((res) => { return res.data });
  }

  // **************
  // Custom Scripts
  // **************

  /*
  Many of the API calls will return a single item. For scenarios that require multiple results or inputs, custom functions have been
  written to handle this.
  */

  async getClientsForDevices(devices, timespan, type) {
    // where type = "MR" MV MX MS MC
    console.log("Running Clients for Devices script...");
    let allClients = [];
    // get clients
    for (let d of devices) {
      if (!d.serial) { return }
      if (!d.model.includes(type)) { continue }
      let clients = [] = await this.getClients(d.serial, timespan);
      for (let c of clients) {
        c.device = d;
        console.log("\n Client Name: " + c.dhcpHostname + "\n MAC: " + c.mac + "\n Device Serial: " + c.device.serial + "\n Device Type: " + c.device.model);
      }
      allClients = clients.concat(allClients);
    }
    console.log("done!");
    return allClients;
  }


  async getClientsForNetworks(nets, timespan, type) {
    // where type = "MR" MV MX MS MC
    console.log("Running Clients for Networks script...");

    let allClients = [];
    // get clients for a network
    for (let n of nets) {
      if (!n.id) { return }
      let clients = [] = await this.getClientsForNetwork(n.id, timespan, type);
      allClients = clients.concat(allClients);
    }
    console.log("done!");
    return allClients;
  }


  async getClientsForOrg(orgId, timespan, type) {
    // where type = "MR" MV MX MS MC
    console.log("Running Clients for Org script...");
    // get networks
    let nets = [] = await this.getNetworks(orgId);
    // get clients for each network
    let allClients = await this.getClientsForNetworks(nets, timespan, type);
    console.log("done!");
    return allClients;
  }



  async getClientPolicyForClients(clients, netId, timespan) {
    console.log("Running Client Policy for Clients script...");
    console.log('clients:', clients);
    console.log('netId: ', netId);
    for (let c of clients) {
      console.log("\n Client Name: " + c.dhcpHostname + "\n MAC: " + c.mac);
      try {
        const policy = await this.getClientPolicy(netId, c.mac, timespan);
        //console.log("policy: ", policy);       
        if (!policy) { return }
        console.log(" - Policy Type " + policy.type);
        if (policy.groupPolicyId) {
          console.log(" - ID: " + policy.groupPolicyId);
        }
        c.policy = policy;
      } catch (e) {
        console.log('error getting client policy', e);
        continue;
      }
    }
    console.log("done!");
    return clients;

  }

  // Synchronous script to traverse the Meraki API and display the clients and their policies
  async getClientsForNetwork(netId, timespan, type) {
    console.log("Running Clients for Network script...");

    try {
      // GET Devices for a Network
      const devices = [] = await this.getDevices(netId);
      //console.log("Devices: ", devices);

      // GET Clients for each Device
      let clients = [] = await this.getClientsForDevices(devices, timespan, type);

      console.log('clients for network: ', netId, clients);
      console.log("done!");
      return clients;
    } catch (e) {
      console.log("error getClientsForNetwork")
      return _handleError(e);
    }
  }



}

