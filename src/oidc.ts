import { RemoveParameter } from './utils/url'
import cookie from "./utils/cookie";

class Oidc implements IAuthorizationCodeFlow , IAuthorizationCredential{
	conf!: OidcConfugiration;
	constructor(conf: OidcConfugiration)
	{
		Object.assign(this.conf, conf);
	}
	GetAuthCode(): string | null {
		let searchParams = new URL(window.location.href).searchParams;
		return  searchParams.get("code");
	}
	GetToken(): string {
     return cookie.GetValue("access_token");
	}
	/* Base Token Request */
	async RequestToken(params: string): Promise<string> {
		const { baseUrl, tokenEndpoint } = this.conf
		const url = `${baseUrl}${tokenEndpoint}`
		const method = "POST"
		const headers = { 'Content-type': 'application/x-www-form-urlencoded' };
		let body = params
		const res = await fetch(url, { method, headers, body })
		if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

		const { access_token } = await res.json()
		return access_token as string
	}
	/* 使用 user credential 向 oidc 伺服器請求token */
	async RequestTokenByCredential() :Promise<string>{
		const { client_id, client_secret } = this.conf
		let params = `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`;
		return await this.RequestToken(params);
	};
	/* 使用auth code向 oidc 伺服器請求token */
	async RequestTokenByAuthcode(code: string): Promise<string> {

		let searchParams = new URL(window.location.href).searchParams;
		let session_state = searchParams.get("session_state");

		let redirectUri = RemoveParameter(window.location.href, "code");
		redirectUri = RemoveParameter(redirectUri, "session_state");
		const { client_id, client_secret } = this.conf
		let params = `grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&session_state=${session_state}&redirect_uri=${redirectUri}`;

		return await this.RequestToken(params);
	}
	/* 檢查token是否正確 */
	async RequestTokenStatus(token: string): Promise<Boolean> {
		try {
			const { baseUrl, userinfoEndpoint } = this.conf
			const url = `${baseUrl}${userinfoEndpoint}`;
			let response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${token}`
				}
			});

			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
			let { status } = await response.json();
			return status === 200;
		} catch (error) {
			return false
		}
	}
	/** go to sso page */
	GoLogin(){
		let redirectUri = RemoveParameter(window.location.href, "code");
		redirectUri = RemoveParameter(redirectUri, "session_state");
		const { baseUrl, client_id, authEndpoint } = this.conf
		let loginPage = `${baseUrl}${authEndpoint}?client_id=${client_id}&grant_type=authorization_code&response_type=code&redirect_uri=${redirectUri}`;
		window.location.href = loginPage;
	}
}

export const ExampleConf = {
	baseUrl: "http://localhost:8080/",
	tokenEndpoint:"/realms/TestRealm/protocol/openid-connect/token",
	authEndpoint:"/realms/TestRealm/protocol/openid-connect/auth",
	userinfoEndpoint:"/realms/TestRealm/protocol/openid-connect/userinfo",
	client_id: "",
	client_secret: "",
	scope:""
} as OidcConfugiration


export default Oidc
