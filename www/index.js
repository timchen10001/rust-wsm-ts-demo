async function init() {
  /**
   * const byteArray = new Int8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01,
    0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x73, 0x75, 0x6d, 0x00, 0x00, 0x0a, 0x09,
    0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b, 0x00, 0x18, 0x04, 0x6e, 0x61, 0x6d, 0x65,
    0x01, 0x06, 0x01, 0x00, 0x03, 0x73, 0x75, 0x6d, 0x02, 0x09, 0x01, 0x00, 0x02, 0x00, 0x01, 0x61,
    0x01, 0x01, 0x62
  ]);
   */

  const memoryCreatedInJs = new WebAssembly.Memory({ initial: 1 });
  const importedObject = {
    js: {
      mem: memoryCreatedInJs,
    },
    console: {
      log: () => {
        console.log("importedObject.log");
      },
      error: () => {
        console.error("importedObject.error");
      },
    },
  };
  const sumWasmBuffer = await fetch("sum.wasm").then((res) =>
    res.arrayBuffer()
  );
  debugger;
  const wasm = await WebAssembly.instantiate(sumWasmBuffer, importedObject);
  debugger;
  const unit8Array = new Uint8Array(memoryCreatedInJs.buffer, 0, 2);
  const hiText = new TextDecoder().decode(unit8Array);

  console.log({ hiText });

  debugger;
  const test1 = sum(1, 2);
  console.log("test1", test1);
  const test2 = sum(3, 4);
  console.log("test2", test2);
}

init();

/**
 * WebAssembly

  (module
    (import "console" "log" (func $log))
    (import "console" "error" (func $error))
    (memory (import "js" "mem") 1)
    (data (i32.const 0) "Hi")
    (func $sum (param $a i32) (param $b i32) (result i32)
      call $log
      call $error
      local.get $a
      local.get $b
      i32.add
    )
    (export "sum" (func $sum))
  )
 */
