import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/edit", // [경로]
    name: "Edit", // [이름]
    component: () => import("./Edit.vue"), // [로드 파일]
  },
  {
    path: "/", // [경로]
    name: "Home", // [이름]
    component: () => import("./Home.vue"), // [로드 파일]
  },
  {
    path: "/mypage",
    name: "MyPage",
    component: () => import("./MyPage.vue"),
  },
  {
    path: "/notfound",
    name: "NotFound",
    component: () => import("./NotFound.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/notfound",
  },
  {
    path: "/verify-email",
    name: "Verify",
    component: () => import("./Verify.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
