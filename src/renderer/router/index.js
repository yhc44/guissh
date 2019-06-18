import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/config',
      component: require('@/components/SSHConfig').default,
      name: 'ssh-config'
    },
    {
      path: '/settings',
      component: require('@/components/Settings').default
    },
    {
      path: '/heavyload'
    }
  ]
})
