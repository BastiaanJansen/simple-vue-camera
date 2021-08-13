module.exports = {
    purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            borderWidth: {
                1: "1px",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
