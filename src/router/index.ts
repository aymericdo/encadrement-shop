import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/HomePage.vue";
import FourOhFour from "../views/FourOhFourPage.vue";
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
    component: () => import("../views/AboutPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    component: FourOhFour,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
