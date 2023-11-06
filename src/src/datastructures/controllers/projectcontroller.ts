


import ProjectAction from './projectaction';
import ActionController from './actioncontroller';
import BlockController from './blockcontroller';
import DragController from "./dragcontroller";
import ExecController from "./execcontroller";
import ErrorController from "./errorcontroller";
import { Observable, Observer } from '@/util/observer';
import Project from '../project/project';


export default class ProjectController extends Observable implements Observer {
  public constructor(project: Project) {
    super();
    this._project = project;
    this._dragcontroller = new DragController();
    this._execcontroller = new ExecController(this._project);
    this._actioncontroller = new ActionController();
    this._blockcontroller = new BlockController(this._project,this._dragcontroller, this._actioncontroller);
    this._blockcontroller.addObserver(this);
    this._errorcontroller = new ErrorController(this._project, this._blockcontroller);
  }
  update(message: any): void {
    if (message instanceof ProjectAction) {
      this.notifyObservers(message);
    }
  }

  public getProject(): Project {
    return this._project;
  }

  public getActionController(): ActionController {
    return this._actioncontroller;
  }
  public getBlockController(): BlockController {
    return this._blockcontroller;
  }
  public getDragController(): DragController {
    return this._dragcontroller;
  }
  public getExecController(): ExecController {
    return this._execcontroller;
  }
  public getErrorController() : ErrorController {
    return this._errorcontroller;
  }

  private _actioncontroller: ActionController;
  private _blockcontroller: BlockController;
  private _dragcontroller: DragController;
  private _execcontroller: ExecController;
  private _errorcontroller: ErrorController;
  private _project: Project;
}
