class iConsole {
  constructor() {

  }
  static install(doc) {
    const env = process.env.NODE_ENV === 'production';
    if(env) return; 
    var script = doc.createElement("script");
    script.src = "//cdn.jsdelivr.net/npm/eruda";
    doc.body.appendChild(script);
    script.onload = function () {
      eruda.init();
    };
  }
}
export default iConsole;