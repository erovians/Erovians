export const ROLE_PERMISSIONS = {
  // Owner: [
  //   "dashboard_view",
  //   "product_create",
  //   "product_update",
  //   "order_view",
  //   "order_update",
  //   "team_manage",
  //   "profile_update",
  // ],
  Manager: ["dashboard_view", "product_update", "order_view", "order_update"],
  Staff: ["dashboard_view", "order_view"],
};
