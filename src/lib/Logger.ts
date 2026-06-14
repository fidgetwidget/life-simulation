export class Logger {
  public static log(...data: any[]) {
    console.log(...data);
  }
  public static info(...data: any[]) {
    console.info(...data);
  }
  public static warn(...data: any[]) {
    console.warn(...data);
  }
  public static error(...data: any[]) {
    console.error(...data);
  }
  public static debug(...data: any[]) {
    __DEBUG__ && console.debug(...data);
  }
}
