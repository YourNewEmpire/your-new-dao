const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      opacity: {
        10: "0.1",
        20: "0.2",
        30: "0.3",
        40: "0.4",
        50: "0.5",
        60: "0.6",
        70: "0.7",
        80: "0.8",
        90: "0.90",
      },
      fontSize: {
        xs: ".75rem",
        sm: ".875rem",
        tiny: ".875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "7rem",
      },
      fontFamily: {
        body: ["Be Vietnam Pro"],
      },
      backgroundImage: {
        "about-card": "url('/aboutcard.png')",
        "projects-card": "url('/projectscard.png')",
        "contact-card": "url('/contactcard.png')",
      },
      colors: {
        gray: colors.gray,
        slate: colors.slate,
        lightblue: colors.sky,
        darkblue: colors.indigo,
        teal: colors.teal,
        cyan: colors.cyan,
        blue: colors.blue,
        red: colors.rose,
        pink: colors.pink,
        green: colors.lime,
        purple: colors.violet,
        amber: colors.amber,
        fuchsia: colors.fuchsia,
        moralis: "#c5fa00",
        'th-background': 'var(--background)',
        'th-background-secondary': 'var(--background-secondary)',
        'th-foreground': 'var(--foreground)',
        'th-primary-dark': 'var(--primary-dark)',
        'th-primary-medium': 'var(--primary-medium)',
        'th-primary-light': 'var(--primary-light)',

        'th-accent-dark': 'var(--accent-dark)',
        'th-accent-medium': 'var(--accent-medium)',
        'th-accent-light': 'var(--accent-light)',

        'th-accent-success': 'var(--accent-success)',
        'th-accent-success-light': 'var(--accent-success-light)',
        'th-accent-success-medium': 'var(--accent-success-medium)',
        'th-accent-success-dark': 'var(--accent-success-dark)',

        'th-accent-failure': 'var(--accent-failure)',
        'th-accent-failure-light': 'var(--accent-failure-light)',
        'th-accent-failure-medium': 'var(--accent-failure-medium)',
        'th-accent-failure-dark': 'var(--accent-failure-dark)',

        'th-accent-info': 'var(--accent-info)',
        'th-accent-info-light': 'var(--accent-info-light)',
        'th-accent-info-medium': 'var(--accent-info-medium)',
        'th-accent-info-dark': 'var(--accent-info-dark)',

        'th-accent-warning': 'var(--accent-warning)',
        'th-accent-warning-light': 'var(--accent-warning-light)',
        'th-accent-warning-medium': 'var(--accent-warning-medium)',
        'th-accent-warning-dark': 'var(--accent-warning-dark)',
      },
      keyframes: {
        pop: {
          "0%, 100%": {
            transform: "translateX(0%)",
          },

          "50%": {
            transform: "translateX(20%)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 2s ease-in-out ",
        pop: "pop 0.75s ease-in-out infinite ",
        spin: "spin infinite linear  8s",
        spinFast: " spin infinite linear 3s",
        shadowGlow: "shadowGlow 2s alternate infinite ease-in-out",
        shadowGlowMd: "shadowGlowMd 2s alternate infinite ease-in-out",
        shadowGlowLg: "shadowGlowLg 2s alternate infinite ease-in-out",
        bottomShadow: "bottomShadow 1s alternate infinite ease-in-out",
        bgShift: "bgShift 2s alternate infinite ease-in-out",
      },
    },
    plugins: [
      require('tailwindcss-textshadow')
    ]
  },
};
