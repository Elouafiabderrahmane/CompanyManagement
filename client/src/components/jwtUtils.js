import { jwtDecode } from "jwt-decode";


const getUserDataFromToken = (token) => {
  try {
    if (!token) {
      console.error("No token provided");
      return { username: "GUEST", role: "USER" };
    }

    const decodedToken = jwtDecode(token); // Correct function name
    console.log("decodedToken", decodedToken);

    const username = decodedToken.sub || "Guest";
    const role = decodedToken.scope || "USER";

    console.log("Username:", username);
    console.log("Role:", role);

    return { username, role };
  } catch (error) {
    console.error("Invalid token:", error);
    return { username: "GUEST", role: "USER" };
  }
};

export { getUserDataFromToken };
