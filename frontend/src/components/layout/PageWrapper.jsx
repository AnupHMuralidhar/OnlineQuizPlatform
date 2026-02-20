import React from "react";

export default function PageWrapper({
  children,
  width = "500px"
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
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.15)"
  }
};
