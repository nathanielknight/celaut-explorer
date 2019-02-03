// Modules weren't playing nicely, so we're packaging code the old fashioned way (i.e. in one global scope)
// and faking it for the type system.
interface CelautApp {
  new (arg0: string, arg1: string): CelautApp;
  free(): void;
  write_imagedata(arg0: Uint8Array): void;
}
declare var CelautApp: CelautApp;

const SEED_SIZE = 128;
const TABLE_SIZE = 49;
const CELL_VALUES = "0123";

var manager: AppManager;

function assert(cond: boolean, msg: string | undefined): void {
  if (!cond) {
    throw new Error(msg);
  }
}

function randomValues(cnt: number): string {
  var result = "";
  for (var i = 0; i < cnt; i++) {
    let c = Math.floor(Math.random() * 4).toString();
    result += c;
  }
  return result;
}

function checkValues(src: string, expectedLength: number): void {
  assert(
    src.length == expectedLength,
    `Invalid values length (should be ${expectedLength})`
  );
  for (var c of src) {
    assert(
      CELL_VALUES.includes(c),
      `Invalid character: {c} (expecting only 0, 1, 2, 3)`
    );
  }
}

function setDataUrlLink(src: string): void {
  let target = <HTMLAnchorElement>document.getElementById("data-url-target");
  target.href = src;
}

interface AppState {
  seed: string | undefined;
  table: string;
}

class AppManager {
  private seed: string = randomValues(SEED_SIZE);
  private table: string = randomValues(TABLE_SIZE);
  private cnv: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(seed?: string, table?: string) {
    this.cnv = <HTMLCanvasElement>document.getElementById("celaut-canvas");
    this.ctx = <CanvasRenderingContext2D>this.cnv.getContext("2d");
    this.newSeed(seed);
    this.newTable(table);
  }

  newSeed(seed?: string): void {
    if (seed != undefined) {
      checkValues(seed, SEED_SIZE);
      this.seed = seed;
    } else {
      this.seed = randomValues(SEED_SIZE);
    }
  }

  newTable(table?: string): void {
    if (table != undefined) {
      checkValues(table, TABLE_SIZE);
      this.table = table;
    } else {
      this.table = randomValues(TABLE_SIZE);
    }
  }

  getState(): AppState {
    return {
      seed: this.seed,
      table: this.table
    };
  }

  setState(state: AppState) {
    this.newSeed(state.seed);
    this.newTable(state.table);
  }

  render(): void {
    let imgdata = this.ctx.getImageData(0, 0, SEED_SIZE, SEED_SIZE);
    let app = new CelautApp(this.seed, this.table);
    app.write_imagedata(<any>imgdata.data);
    this.ctx.putImageData(imgdata, 0, 0);
    let dataUrl = this.cnv.toDataURL();
    setDataUrlLink(dataUrl);
  }

  queryString(): string {
    let sp = new URLSearchParams();
    sp.set("table", this.table);
    return sp.toString();
  }
}

namespace EventHandlers {
  export function randomizeSeed() {
    manager.newSeed();
    history.replaceState(manager.getState(), "", "?" + manager.queryString());
    manager.render();
  }

  export function randomizeTable() {
    manager.newTable();
    history.pushState(manager.getState(), "", "?" + manager.queryString());
    manager.render();
  }

  export function popState(evt: PopStateEvent): void {
    manager.setState(evt.state);
    manager.render();
  }

  export function initialize() {
    let params = new URL(window.location.toString()).searchParams;
    manager = new AppManager();
    if (params.has("table")) {
      let tbl = <string>params.get("table");
      console.log(tbl);
      manager.newTable(tbl);
    } else {
      manager.newTable();
    }
    manager.render();
  }
}
