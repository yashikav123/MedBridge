module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#5F6FFF",
        },
        gridTemplateColumns: { // ✅ Fixed colon instead of semicolon
          auto: "repeat(auto-fit, minmax(200px, 1fr))",
        },
      },
    },
    plugins: [],
  };
  