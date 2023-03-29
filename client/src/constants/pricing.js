export const plans = [
  {
    id: 1,
    name: "Personal",
    price: 1,
    frequency: "Daily",
    features: ["CNAME Record", "A Record", "Billed Monthly"],
  },
  {
    id: 2,
    name: "Student",
    price: 0.5,
    frequency: "Daily",
    features: ["CNAME Record", "A Record", "Billed Monthly"],
  },
  {
    id: 3,
    name: "Annual",
    price: 150,
    frequency: "Yearly",
    features: ["CNAME Record", "A Record", "Hassle-free for an year"],
  },
];

export const features = {
  personal: ["CNAME Record", "A Record", "Billed Monthly"],
  student: ["CNAME Record", "A Record", "Billed Monthly"],
  annual: ["CNAME Record", "A Record", "Hassle-free for an year"],
};
