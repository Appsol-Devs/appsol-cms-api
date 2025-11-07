import type { Container } from "inversify";
import { bindRepositories } from "./repositories.js";
import { bindAllInteractors } from "./interactors.js";
import { bindAllControllers } from "./controllers.js";

export function registerAllBindings(container: Container) {
  bindRepositories(container);
  bindAllInteractors(container);
  bindAllControllers(container);
}
