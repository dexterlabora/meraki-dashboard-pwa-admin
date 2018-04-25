import Vue from 'vue'
import Router from 'vue-router'


// Chart Components -- TEST
/*
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import DoughnutChart from '@/components/charts/DoughnutChart'
import PieChart from '@/components/charts/PieChart'
*/

// General Components
import Home from '../components/Home'
import About from '../components/About'

// Meraki Pages
import DevicesPage from '../components/meraki/devices/DevicesPage'
import InventoryPage from '../components/meraki/inventory/InventoryPage'
import LicensesPage from '../components/meraki/licenses/LicensesPage'
import NetworksPage from '../components/meraki/networks/NetworksPage'
import CreateNetwork from '../components/meraki/networks/CreateNetwork'
import NetworkDetails from '../components/meraki/networks/NetworkDetails'
import TrafficPage from '../components/meraki/traffic/TrafficPage'
import WirelessPage from '../components/meraki/wireless/WirelessPage'
import ClientsPage from '../components/meraki/clients/ClientsPage'
import OrgDevicesPage from '../components/meraki/org-devices/OrgDevicesPage'

Vue.use(Router)




export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'home',
      component: Home,
      path: '/'
    },
    {
      name: 'about',
      component: About,
      path: '/about'
    },
    {
      name: 'wireless',
      component: WirelessPage,
      path: '/wireless',
    },
    {
      name: 'devices',
      component: DevicesPage,
      path: '/devices'
    },
    {
      name: 'licenses',
      component: LicensesPage,
      path: '/licenses'
    },
    {
      name: 'inventory',
      component: InventoryPage,
      path: '/inventory'
    },
    {
      name: 'networks',
      component: NetworksPage,
      path: '/networks'
    },
    {
      name: 'createNetwork',
      component: CreateNetwork,
      path: '/createnetwork'
    },
    {
      name: 'networkDetails',
      component: NetworkDetails,
      path: '/networkdetails',
      props: true
    },
    {
      name: 'traffic',
      component: TrafficPage,
      path: '/traffic'
    },
    {
      name: 'clients',
      component: ClientsPage,
      path: '/clients'
    },
    {
      name: 'orgDevices',
      component: OrgDevicesPage,
      path: '/orgdevices'
    }
  ]
})

