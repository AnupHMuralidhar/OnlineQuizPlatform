import React from "react";
import { theme } from "../styles/theme";

export default function DashboardLayout({ sidebar, children }) {
  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        {sidebar}
      </aside>

      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: theme.colors.background
  },

  sidebar: {
    width: "260px",
    background: theme.colors.card,
    borderRight: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.lg,
    display: "flex",
    flexDirection: "column"
  },

  main: {
    flex: 1,
    padding: theme.spacing.xl
  }
};
