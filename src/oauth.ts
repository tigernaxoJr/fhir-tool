/* 登入檢查 */
export async function AuthCredential(provider: IAuthorizationCredential): Promise<Boolean> {

	let token = provider.GetToken(); // token

    // 無token但有auth code (通常為登入後跳轉回來的情況)
    if (!token) {
		token = await provider.RequestTokenByCredential()
    }

    // 已有 token 不跳轉
    let tokenVaild = await provider.RequestTokenStatus(token);
    if (tokenVaild) return true;

	// 怎麼沒有 reflash ??

	provider.GoLogin() // 無token或token驗證失敗，轉跳登入點
	return false;
}


/* 登入檢查 */
export async function AuthCodeFlow(provider: IAuthorizationCodeFlow): Promise<Boolean> {

	let token = provider.GetToken(); // token
    let authCode = provider.GetAuthCode(); // authorization code

    // 無token但有auth code (通常為登入後跳轉回來的情況)
    if (!token && !!authCode ) {
		token = await provider.RequestTokenByAuthcode(authCode)
    }

    // 已有 token 不跳轉
    let tokenVaild = await provider.RequestTokenStatus(token);
    if (tokenVaild) return true;

	// 怎麼沒有 reflash ??

	provider.GoLogin() // 無token或token驗證失敗，轉跳登入點
	return false;
}

export default { AuthCodeFlow, AuthCredential }