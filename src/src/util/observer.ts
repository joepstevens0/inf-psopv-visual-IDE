export interface Observer {
  update(message: any): void;
}

export class Observable {
  /**
   * add a observer for the observable
   * @param o new observer
   */
  public addObserver(o: Observer): void {
    if (!this._observers.includes(o))
      this._observers.push(o);
  }
  /**
   * Remove an observer from observable
   * @param o observer removed
   * @post observer o no longer notified on updates
   */
  public removeObserver(o: Observer): void {
    const index = this._observers.indexOf(o);
    if (index > -1) this._observers.splice(index);
  }
  /**
   * Send a message to all observers of observable
   * @param message send
   */
  public notifyObservers(message: any): void {
    for (let i = 0; i < this._observers.length; ++i) {
      this._observers[i].update(message);
    }
  }

  private _observers: Observer[] = [];
}
