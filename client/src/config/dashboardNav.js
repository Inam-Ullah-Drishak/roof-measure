// Sidebar links for the customer dashboard and the admin panel.
// icon = a key of ICONS in components/dashboard/DashboardShell.js
export const customerNav = [
  { href: "/dashboard", label: "Overview", icon: "home", exact: true },
  { href: "/dashboard/orders/new", label: "New order", icon: "plus" },
  { href: "/dashboard/orders", label: "My orders", icon: "list" },
  { href: "/dashboard/account", label: "Account", icon: "user" },
];

export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "chart", exact: true },
  { href: "/admin/orders", label: "Orders", icon: "list" },
  { href: "/admin/customers", label: "Customers", icon: "users" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "mail" },
  { href: "/admin/team", label: "Team", icon: "team" },
  { href: "/admin/account", label: "Account", icon: "user" },
];

// Employees only work on the orders assigned to them
export const employeeNav = [
  { href: "/admin", label: "My work", icon: "chart", exact: true },
  { href: "/admin/orders", label: "My orders", icon: "list" },
  { href: "/admin/account", label: "Account", icon: "user" },
];
