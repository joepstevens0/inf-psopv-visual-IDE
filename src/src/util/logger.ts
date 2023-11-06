import Vue from "vue";
import VueLogger from 'vuejs-logger';

const USEVUELOGGER = false;

if (USEVUELOGGER){
    const isProduction = process.env.NODE_ENV === 'production';
    const options = {
        isEnabled: true,
        logLevel : isProduction ? 'error' : 'debug',
        stringifyArguments : false,
        showLogLevel : true,
        showMethodName : true,
        separator: '|',
        showConsoleColors: true
    };
    
    Vue.use(VueLogger, options);
}

export default class Logger{
    public static log(...data: any){
        if (USEVUELOGGER){
            Vue.$log.info(...data);
        }else{
            console.log("log |",...data);
        }
    }

    public static warn(...data: any){
        if (USEVUELOGGER){
            Vue.$log.warn(...data);
        }else{
            console.warn("warning |",...data);
        }
    }

    public static error(...data: any){
        if (USEVUELOGGER){
            Vue.$log.error(...data);
        }else{
            console.error("error |",...data);
        }
    }
    public static debug(...data: any){
        if (USEVUELOGGER){
            Vue.$log.debug(...data);
        }else{
            console.debug("debug |",...data);
        }
    }
    public static info(...data: any){
        if (USEVUELOGGER){
            Vue.$log.info(...data);
        }else{
            console.info("info |", ...data);
        }
    }
    public static fatal(...data: any){
        if (USEVUELOGGER){
            Vue.$log.fatal(...data);
        }else{
            console.error("fatal| ",...data);
        }
    }
}