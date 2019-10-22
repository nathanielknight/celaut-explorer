/* tslint:disable */
/**
* Exposed struct for driving the simulation from JavaScript
*/
export class CelautApp {
  free(): void;
/**
* @param {string} seed_src 
* @param {string} table_src 
* @returns {CelautApp} 
*/
  constructor(seed_src: string, table_src: string);
/**
* @param {Uint8Array} buffer 
*/
  write_imagedata(buffer: Uint8Array): void;
}

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        