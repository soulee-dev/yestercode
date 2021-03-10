import * as buffers from './buffers';
import { Frame } from './buffers';

export default class Replay {
  constructor() {
    const replay = new Replay();
  }

  public static start() {
    const textChanges = buffers.all();

    console.log(textChanges);

    textChanges.forEach((currentChange) => {
      let result = '';
      Object.entries(currentChange).forEach((item) => {
        const changes = <Frame>item[1];
        result += changes.changes[0].text;
      });

      console.log(result);
    });
  }
}
