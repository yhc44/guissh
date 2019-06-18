<template>
  <div id="app">
    <link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet">
    <v-layout row justify-center>
      <v-flex xs2>
        <v-list>
          <v-list-tile :to="navItem.route" v-for="navItem in navItems" :key="navItem.text">
            <v-list-tile-avatar>
              <v-icon>
                {{navItem.icon}}
              </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>
              {{navItem.text}}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs10>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  const {ipcRenderer} = require('electron')
  export default {
    data () {
      return {
        navItems: [{
          text: 'Dashboard',
          route: '/',
          icon: 'fas fa-home'
        }, {
          text: 'SSH Config',
          route: '/config',
          icon: 'fas fa-server'
        }, {
          text: 'Settings',
          route: '/settings',
          icon: 'fas fa-cogs'
        }
        ]
      }
    },
    methods: {
      ...mapActions('sshManager', ['initConfigData'])
    },
    name: 'guissh',
    created () {
      const routePath = this.$route.fullPath
      if (routePath === '/') {
        ipcRenderer.send('main_window_rendered')
      } else if (routePath === '/heavyload') {
        ipcRenderer.send('heavyload_window_rendered')
        require('./controller/heavyload')
      }
      ipcRenderer.on('ipc_ready', () => {
        console.log('IPC READY')
        this.initConfigData()
      })
    }
  }
</script>

<style>
  /* CSS */
</style>
