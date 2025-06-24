import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import HomePage from '../pages/HomePage.vue'
import CrudPage from '../pages/CrudPage.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/crud',
    name: 'Crud',
    component: CrudPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
