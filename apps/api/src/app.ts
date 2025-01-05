import createApp from "@/api/lib/create-app";
import { registerRoutes } from "@/api/routes";

import configureOpenAPI from "./lib/configure-open-api";

const app = registerRoutes(createApp());
configureOpenAPI(app);

export default app;
