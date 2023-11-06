import Vue from "vue";
import VueRouter from "vue-router";
import ideApp from "@/components/ideApp.vue";
import login from "@/components/header/login.vue";
import register from "@/components/header/register.vue";
import store from "./store.js";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: ideApp
    }
    /*{
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    /*{
      path: '/resources',
      name: 'resources',
      component: Resource,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    }*/
  ],
  mode: "history"
});

/*router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.getters.isLoggedIn) {
        next()
        return
      }
      next('/login')
    } else {
      next()
    }
});*/

export default router;
