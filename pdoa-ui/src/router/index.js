import Vue from 'vue'
import VueRouter from 'vue-router'
import UserProfile from '../views/Auth/Profile.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import ReplayIndex from '../views/PDOA Replayer/Index.vue'
import HandReplay from '../views/PDOA Replayer/HandReplay.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/users/all',
    name: 'allUsers',
    component: User
  },
  {
    path: '/replay',
    name: 'replayIndex',
    component: ReplayIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/replay/:id',
    name: 'handReplay',
    component: HandReplay,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/profile',
    name: 'userProfile',
    component: UserProfile,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((from, to, next) => {
  if (from.meta.requiresAuth) {
    if (!window.localStorage.getItem('user')) {
      next({
        name: 'login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
