import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import ListPage from "@/components/ListPage.vue";
import MapPage from "@/components/MapPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: { name: "HomeList" },
    children: [
      {
        path: "list",
        name: "HomeList",
        component: ListPage,
      },
      {
        path: "map",
        name: "HomeMap",
        component: MapPage,
      },
    ],
  },
  {
    path: "/dark",
    name: "Dark",
    component: Home,
    redirect: { name: "DarkList" },
    children: [
      {
        path: "list",
        name: "DarkList",
        component: ListPage,
      },
      {
        path: "map",
        name: "DarkMap",
        component: MapPage,
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
