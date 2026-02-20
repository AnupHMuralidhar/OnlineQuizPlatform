import React from "react";

export default function DashboardLayout({ sidebar, children }) {
  return (
    <div style={styles.gradientWrapper}>
      <div style={styles.page}>
        <aside style={styles.sidebar}>
          {sidebar}
        </aside>

        <main style={styles.main}>
          <div style={styles.contentCard}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  /* SAME animated gradient as landing — but LOCAL */
  gradientWrapper: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",

    background: `
      linear-gradient(
        -45deg,
        #4e46e5df,
        #7c3aede3,
        #b033eada,
        #ec489ab2
      )
    `,
    backgroundSize: "400% 400%",
    animation: "dashboardGradientFlow 18s ease infinite",

    color: "white"
  },

  page: {
    display: "flex",
    width: "100%",
    minHeight: "100vh"
  },

  sidebar: {
    width: "260px",
    flexShrink: 0,
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",
    background: "rgba(255,255,255,0.08)",
    borderRight: "1px solid rgba(255,255,255,0.15)",
    padding: "24px",
    display: "flex",
    flexDirection: "column"
  },

  main: {
    flex: 1,
    padding: "40px",
    minWidth: 0
  },

  contentCard: {
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
  }
};
