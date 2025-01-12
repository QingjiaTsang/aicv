import createApp from "@/api/lib/app-config/create-app";
import { registerRoutes } from "@/api/routes";

import configureOpenAPI from "./lib/app-config/configure-open-api";

const app = registerRoutes(createApp());
configureOpenAPI(app);

export default app;
