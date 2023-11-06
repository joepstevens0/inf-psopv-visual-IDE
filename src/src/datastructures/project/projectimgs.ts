import { Observable } from "../../util/observer";
import Logger from '@/util/logger';


export default class ProjectImgs extends Observable {
  /**
   * @returns number of images in project
   */
  public nImgs() {
    return this._imgs.length;
  }

  /**
   * get image name by index
   * @param index of image
   * @returns name of the image with the index <index>
   */
  public getImgName(index: number): string {
    return this._imgs[index].name;
  }

  /**
   * Get the link of an image by index
   * @param index of image
   * @returns link of image on position index
   */
  public getImgLink(index: number): string {
    return this._imgs[index].link;
  }

  /**
   * get link of the image by name
   * @param name of the image
   * @returns link of the image <name>
   */
  public getImgLinkbyname(name: string): string {
    for (let i = 0; i < this._imgs.length; ++i) {
      if (this._imgs[i].name == name)
        return this._imgs[i].link;
    }
    return "";
  }

  /**
   * get the index of an image by name
   * @param name of the image
   * @returns index of image <name>
   */
  public indexOf(name: string): number {
    for (let i = 0; i < this._imgs.length; ++i) {
      if (this._imgs[i].name == name)
        return i;
    }
    return -1;
  }

  /**
   * @returns all image data in an array
   */
  public getImagedata(): { name: string, link: string, x: number, y: number, rot: number, scale: number }[] {
    return this._imgs;
  }

  /**
   * add an image to the projectimgs
   * @param name of the new image
   * @param link of the new image
   * @post image with name <name> and link <link> added
   */
  public addImage(name: string, link: string) {
    for (let i = 0; i < this._imgs.length; ++i) {
      if (this._imgs[i].name == name)
        throw "Imagename not unique";
    }
    this._imgs.push({ name: name, link: link, x: 0, y: 0, rot: 0, scale: 1 });
    this.notifyObservers("imgadd:" + name);

    Logger.debug("ProjectImgs |", "image added to project with name:", name, "and link:", link);
  }

  /**
   * delete an image by index
   * @param index of image
   * @post image on index <index> is deleted
   * @post image indices higher then <index> are reduced by one
   * @pre index < nImgs()
   */
  public deleteImg(index: number) {
    const name = this._imgs[index].name;
    this._imgs.splice(index, 1);
    this.notifyObservers("imgdelete:" + name);

    Logger.debug("ProjectImgs |", "image deleted from project with name:", name);
  }

  /**
   * save projectimgs in JSON format
   * @returns save data in JSON
   */
  public save(): any {
    return this._imgs;
  }

  /**
   * load projectimgs from json data
   * @param data created from the save() function
   * @post images are loaded into the project
   */
  public static load(data: any): ProjectImgs {
    const pv = new ProjectImgs();
    pv._imgs = data;
    return pv;
  }

  private _imgs: { name: string, link: string, x: number, y: number, rot: number, scale: number }[]
    = [{ name: "Dinosaurus", link: "dinosaur-cartoon-png-2.png", x: 0, y: 0, rot: 0, scale: 1 }];
}