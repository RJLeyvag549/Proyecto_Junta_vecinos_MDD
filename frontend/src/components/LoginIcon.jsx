const LoginIcon = () => {
  return (
    <div style={styles.container}>
      <img src="/family.png" alt="Family Icon" style={styles.image} />
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "100px",
    left: "50%",
    transform: "translateX(-50%)",
    border: "1px solid white",
    borderRadius: "50%",
    padding: "10px",
    backgroundColor: "white",
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  image: {
    width: "40px",
    height: "40px",
    objectFit: "contain",
  },
};

export default LoginIcon;
