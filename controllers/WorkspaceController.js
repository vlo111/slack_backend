import Workspace from "../models/workspace";
import validate from "../services/validate";

class WorkspaceController {
  static create = async (req, res, next) => {
    try {
      await validate(req.body, {
        workspace: "required|string",
        member: "string",
      });

      const { workspace, member } = req.body;

      const workspaceExists = await Workspace.findOne({ workspace });

      if (workspaceExists) {
        res.json({
            status: "exist",
          });
      } else {
        const workspaceCreate = new Workspace({
          workspace,
          member,
        });

        await workspaceCreate.save();
        
        res.json({
            status: "ok",
          });
      }
    } catch (e) {
      next(e);
    }
  };

  static getAllWorkspaces = async (req, res, next) => {
    try {

      const { userId } = req.params;

      //todo get all Workspace by user id
      const workspaces = await Workspace.find({});

      res.json({
        status: "ok",
        workspaces,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default WorkspaceController;
