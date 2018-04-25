
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


function _handleError(e) {
  console.log("error in Meraki API call: ", e);
  if (e.response) {
    if (e.response.data) {
      // Meraki specific error message
      if (e.response.data.errors){
        console.log(e.response.data.errors[0]);
      }     
    } else {
      console.log(e.response)
    }
  } else {
    console.log(e);
  }
  return e;
  
}


export default class merakiService {



  constructor(apiKey, baseUrl) {
    this._apiKey = apiKey;
    this._baseUrl = baseUrl;
    this.initMeraki();
    /*
    this.meraki = axios.create({
      baseURL: this._baseUrl,
      headers: { 'X-Cisco-Meraki-API-Key': this._apiKey }
    });
    */
  }

  initMeraki(){
    this.meraki = axios.create({
      baseURL: this._baseUrl,
      headers: { 'X-Cisco-Meraki-API-Key': this._apiKey }
    });
  }

  get apiKey(){
    return this._apiKey;
  }

  set apiKey(apiKey){
    this._apiKey = apiKey;
    this.initMeraki();
  }

  get baseUrl(){
    return this._baseUrl;
  }

  set baseUrl(baseUrl){
    this._baseUrl = baseUrl;
    this.initMeraki();
  }


  async getOrganizations() {
    try {
      // GET Organizations (extra helper for orgs being accidentally parsed as Ints)
      let orgs = await this.meraki.get('/organizations', { transformResponse: [data => data] }).then((res) => { return res.data });
      orgs = JSONbig.parse(orgs);
      return orgs;
    } catch (e) {
      return _handleError(e);
    }
  }

  async getNetworks(orgId) {
    try {
      // GET Networks for an organization
      return await this.meraki.get('/organizations/' + orgId + '/networks').then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    }
  }

  async getInventory(orgId) {
    try {
      // GET Inventory for an organization
      return await this.meraki.get('/organizations/' + orgId + '/inventory').then((res) => { 
        console.log('meraki-service getInventory ', res.data)
        return res.data
       });
    } catch (e) {
      return _handleError(e);
    }
  }

  async getLicenseState(orgId) {
    try {
      // GET Licenses for an organization
      return await this.meraki.get('/organizations/' + orgId + '/licenseState').then((res) => { 
        return res.data
       });
    } catch (e) {
      return _handleError(e);
    }
  }

  async getSsids(netId) {
    try {
      // GET SSIDs for an organization
      return await this.meraki.get('/networks/' + netId + '/ssids').then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    }
  }

  async updateSsid(netId, number) {
    try {
      // GET Networks for an organization
      return await this.meraki.get('/networks/' + netId + '/ssids/'+number).then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    }
  }

  async getOrgDevices(orgId) {
    try {
      // GET Networks for an organization
      return await this.meraki.get('/organizations/' + orgId + '/deviceStatuses').then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    }
  }

  async getPolicies(netId) {
    try {
      // GET Policies for a network
      return await this.meraki.get('/networks/' + netId + '/groupPolicies').then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    } 
  }

  async getTraffic(netId, timespan) {
    try {
      // GET Traffic for a network
      return await this.meraki.get('/networks/' + netId + '/traffic?timespan='+timespan).then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    } 
  }

  async getDevices(netId) {
    try {
      // GET Devices for a network
      return await this.meraki.get('/networks/' + netId + '/devices').then((res) => { 
        console.log('meraki-service getDevices', res.data);
        return res.data
       });
    } catch (e) {
      return _handleError(e);
    }
  }

  async getClients(serial, timespan) {
    try {
      // GET Cliets for a Meraki device serial for a given timespan in seconds
      return await this.meraki.get('/devices/' + serial + '/clients?timespan=' + timespan).then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    }
  }

  async getClientPolicy(netId, clientMac, timespan) {
    try {
      // GET Policies for a network
      return await this.meraki.get('/networks/' + netId + '/clients/' + clientMac + '/policy?timespan=' + timespan).then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    }
  }

  async updateClientPolicy(netId, clientMac, timespan, data) {
    try {
      // PUT Policies for a network
      return await this.meraki.put('/networks/' + netId + '/clients/' + clientMac + '/policy?timespan=' + timespan, data).then((res) => { return res.data });
    } catch (e) {
      return _handleError(e);
    }
  }

  // ****
  // Custom Scripts
  // ****

  async getClientPolicyOfNet(clients){

  }

  // Synchronous script to traverse the Meraki API and display the clients and their policies
  async getClientsForNetwork(netId, timespan) {
    console.log("Running Clients for Network script...");
    let allClients = [];
    try {
      // GET Devices for a Network
      const devices = [] = await this.getDevices(netId);
      //console.log("Devices: ", devices);

      // GET Clients for each Device
      for (let d of devices) {
        console.log("\n-- Device -- \n Name: " + d.name + "\n Serial: " + d.serial + "\n Model: " + d.model);

        // Skip Camera and Phone devices
        if (d.model.includes("MV") || d.model.includes("MC")){ continue}
        const clients = [] = await this.getClients(d.serial, timespan);
        console.log("\n-- Clients --");
              
        // GET Policy for each Client
        for (let c of clients) {
          console.log("\n Client Name: " + c.dhcpHostname + "\n MAC: " + c.mac);
          c.device = d;
          try{
            const policy = await this.getClientPolicy(netId, c.mac, timespan);//.catch(e => console.log('error getting client policy'));
            //console.log("policy: ", policy);       
            if(!policy){return}
            console.log(" - Policy Type " + policy.type);
            if (policy.groupPolicyId) {
                console.log(" - ID: " + policy.groupPolicyId);
            }
            c.policy = policy;
          } catch(e){
            console.log('error getting client policy',e);
            continue;
          }
            

          
        }
        // return all clients with policy information
        allClients = clients.concat(allClients);   
      }
      console.log("\n \n Done! \n");
      console.log('allClients: ', allClients);
      return allClients;
    } catch (e) {
      console.log("error ClientPolicySummary")
      return _handleError(e);
    }
  }

  // Custom tool to iterate through all Orgs, then all Nets to return Group Policies
  // TODO consider sending in an orgs array for more flexibility
  async getClientPoliciesForAllOrgs() {
    console.log("Running Meraki Group Policy Summary Tool...");
    let results = [];
    try {
      // Get Organizations
      const orgs = await this.getOrganizations();
      //console.log("Organizations:", nets);

      // GET Networks for each Organization
      for (let o of orgs) {
        const nets = await this.getNetworks(o)
        //console.log("Networks:", nets);

        console.log("\n-- Organization -- \n Name: " + o.name + "\n ID: " + o.id);

        // GET Group Polices for each Network
        for (let n of nets) {
          const policies = await this.getPolicies(n);
          //console.log("Policies:", policies);

          console.log("\n-- Network -- \n Name: " + n.name + "\n ID: " + n.id);
          console.log("\n Group Policies");
          if (policies.length < 1) { console.log(" None") }
          for (let p of policies) {
            console.log("\n Name: " + p.name + "\n ID: " + p.groupPolicyId);
            results.push({
              "organization": {
                "name": o.name,
                "id": o.id,
              },
              "network": {
                "name": n.name,
                "id": n.id
              },
              "groupPolicy": {
                "name": p.name,
                "id": p.groupPolicyId
              }
            });
          }
          
        }
      }

      console.log("\n \n Done! \n");
      return results;
    } catch (e) {
      console.log("error in summary: ", e);
    }
  }



}



//module.exports = merakiService;

