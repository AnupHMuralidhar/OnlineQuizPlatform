import React from "react";
import { theme } from "../styles/theme";

export default function PageWrapper({
  children,
  width = "420px"
}) {
  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, width }}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: theme.colors.background,
    padding: theme.spacing.lg
  },

  card: {
    background: theme.colors.card,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadow.md,
    border: `1px solid ${theme.colors.border}`,
    transition: theme.transition
  }
};
