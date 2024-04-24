import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");
const withMT = require("@material-tailwind/react/utils/withMT");
const config: Config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    }, fontFamily: {
      'thsarabun': ['THSarabunNew', 'sans-serif'],
      roboto: ['Roboto', 'sans-serif'],
    },
  },
  plugins: [
    require("daisyui"),
    flowbite.plugin(),
  ]
});
module.exports = config;

export default config;
