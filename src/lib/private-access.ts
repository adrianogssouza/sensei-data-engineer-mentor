import { getPrivateAccessEnv } from "@/lib/env";

const PRIVATE_ACCESS_USERNAME = "sensei";

export function hasPrivateAccess(request: Request): boolean {
  const { SENSEI_PRIVATE_ACCESS_PASSWORD } = getPrivateAccessEnv();

  if (!SENSEI_PRIVATE_ACCESS_PASSWORD) {
    return true;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return (
      username === PRIVATE_ACCESS_USERNAME &&
      password === SENSEI_PRIVATE_ACCESS_PASSWORD
    );
  } catch {
    return false;
  }
}

export function getPrivateAccessResponse() {
  return Response.json(
    { available: false, error: "Private access required." },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="SENSEI"',
      },
    },
  );
}
