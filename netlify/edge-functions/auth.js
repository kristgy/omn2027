export default async (request, context) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return new Response("Authentication required for OMN 2027 Committee Review", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="OMN 2027 Committee Review"',
      },
    });
  }

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const decoded = atob(encoded);
  const [user, password] = decoded.split(":");

  // Reviewer credentials:
  // Username: committee
  // Password: fie3aljd4f9d8
  const VALID_USER = "committee";
  const VALID_PASS = "fie3aljd4f9d8";

  if (user === VALID_USER && password === VALID_PASS) {
    return context.next();
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="OMN 2027 Committee Review"',
    },
  });
};
