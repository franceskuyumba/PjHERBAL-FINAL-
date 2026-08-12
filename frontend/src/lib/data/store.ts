import type { Coupon, Region } from "../types";

export const regions: Region[] = [
  {
    name: "Dar es Salaam",
    districts: ["Kinondoni", "Ilala", "Temeke", "Kigamboni", "Ubungo", "Kibaha"],
    deliveryFee: 3000,
    eta: "Same day (within city)",
  },
  {
    name: "Arusha",
    districts: ["Arusha City", "Meru", "Karatu", "Monduli"],
    deliveryFee: 6000,
    eta: "1–2 days",
  },
  {
    name: "Dodoma",
    districts: ["Dodoma City", "Bahi", "Chamwino", "Kongwa"],
    deliveryFee: 6000,
    eta: "1–2 days",
  },
  {
    name: "Mwanza",
    districts: ["Mwanza City", "Nyamagana", "Ilemela", "Misungwi"],
    deliveryFee: 6000,
    eta: "1–2 days",
  },
  {
    name: "Mbeya",
    districts: ["Mbeya City", "Mbalizi", "Rungwe", "Kyela"],
    deliveryFee: 7000,
    eta: "2–3 days",
  },
  {
    name: "Tanga",
    districts: ["Tanga City", "Muheza", "Korogwe", "Handeni"],
    deliveryFee: 7000,
    eta: "2–3 days",
  },
  {
    name: "Morogoro",
    districts: ["Morogoro City", "Mvomero", "Kilosa"],
    deliveryFee: 6000,
    eta: "1–2 days",
  },
  {
    name: "Zanzibar",
    districts: ["Urban West", "North A", "North B", "South", "Central"],
    deliveryFee: 9000,
    eta: "2–3 days",
  },
  {
    name: "Other Regions",
    districts: ["Nationwide delivery"],
    deliveryFee: 8000,
    eta: "2–4 days",
  },
];

export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    discountType: "percent",
    value: 10,
    minOrder: 30000,
    active: true,
  },
  {
    code: "AFYA20",
    discountType: "percent",
    value: 20,
    minOrder: 100000,
    active: true,
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    value: 3000,
    minOrder: 80000,
    active: true,
  },
];
