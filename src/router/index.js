import { nextTick } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { checkPlatform } from "@/utils/helper.js";
import { isLogin } from "@/utils/auth.js";
import routes from "@/router/routes.js";

// 基础配置
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// 页面回顶
const scrollToTop = () => {
  nextTick().then(() => {
    const mainLayout = document.getElementById("main-layout");
    mainLayout?.scrollIntoView({ behavior: "smooth" });
  });
};

// 路由守卫
router.beforeEach((to, from, next) => {
  // 开始进度条
  if (to.path !== from.path) {
    if (typeof $loadingBar !== "undefined" && !checkPlatform.electron()) {
      $loadingBar.start();
    }
  }
  // 判断是否需要登录
  if (to.meta.needLogin) {
    if (isLogin()) {
      next();
    } else {
      $message.warning("请登录后使用");
      if (typeof $loadingBar !== "undefined" && !checkPlatform.electron()) {
        $loadingBar.error();
      }
      if (typeof $changeLogin !== "undefined") $changeLogin();
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  // 结束进度条
  if (typeof $loadingBar !== "undefined" && !checkPlatform.electron()) $loadingBar.finish();
  // 页面回顶
  scrollToTop();
});

export default router;
