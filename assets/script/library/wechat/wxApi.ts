import { Config } from "../../Constants";

export class wxApi {
    static async login(): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.login({
                success: function (code) {
                    resolve(code);
                },
                fail: function (...args) {
                    reject(...args);
                },
                complete: function () {
                },
            })
        });
    }

    static async callFunction(name: string): Promise<any> {
        // 在调用云开发各 API 前，需先调用初始化方法 init 一次（全局只需一次，多次调用时只有第一次生效）
        wx.cloud.init({
            env: Config.WXCloudEnvID,
        })
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: name,
                success: function (res) {
                    resolve(res);
                },
                fail: function () {
                    reject();
                },
                complete: function () {
                },
            });
        });
    }

    static async checkSession(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("wx checksession");
            wx.checkSession({
                success: function () {
                    resolve();
                },
                fail: function () {
                    reject();
                },
                complete: function () {
                },
            });
        });
    }

    static async authorize(scope: string): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.authorize({
                scope: scope,
                success: function (res) {
                    resolve(res);
                },
                fail: function (res) {
                    reject(res);
                }
            })
        });
    }

    static async getUserInfo(withCredentials: boolean, lang?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                withCredentials: withCredentials,
                lang: lang,
                success: function (res) {
                    resolve(res);
                },
                fail: function (res) {
                    reject(res)
                }
            })
        });
    }

    static async getSetting(): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: function (res) {
                    resolve(res);
                },
                fail: function () {
                    reject();
                }
            });
        });
    }

    static async authSettingOfUserInfo(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let res = await wxApi.getSetting();
                if (res.authSetting && res.authSetting['scope.userInfo']) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (e) {
                resolve(false);
            }
        });
    }


    // static showLoading(title: string = "") {
    //     wx.showLoading({
    //         title: title,
    //         mask: true
    //     });
    // }

    // static hideLoading() {
    //     wx.hideLoading({
    //     });
    // }

    // static showToast(title: string, duration: any = 1000) {
    //     wx.showToast({
    //         title: title,
    //         icon: 'success',
    //         duration: duration,
    //     });
    // }

    // static hideLoading() {
    //     wx.hideLoading({
    //     });
    // }





    static getUserGameLabel() {

    }
}
