import * as vscode from "vscode";
import { IAction } from "./interfaces";
import { _performAction } from "./performer";

export class ActionsController {
    public static readonly actions: IAction[] = [];

    public static loadActions() {
      vscode.extensions.all.forEach((extension) => {
        if (extension.packageJSON.BAScontributes && extension.packageJSON.BAScontributes.actions)
        {
          ActionsController.actions.push(extension.packageJSON.BAScontributes.actions);
        }
      });
    }

    public static getAction(id: string) {
      for (const action of ActionsController.actions) {
        if (action.id === id) {
          return action;
        }
      }
    }

    public static performScheduledActions() {
        const actionsSettings = vscode.workspace.getConfiguration();
        const actionsList: any[] | undefined = actionsSettings.get("actions");
        if (actionsList && actionsList.length) {
          for (const action of actionsList) {
            console.log(
              `performing action ${action.name} of type ${action.constructor.name}`
            );
            _performAction(action);
          }
          actionsSettings.update("actions", []);
        }
      }
}
