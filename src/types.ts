export interface IAuthorizationBase {
	GetToken: () => string;
	GetAuthCode: () => string | null;
	// RequestTokenByAuthcode: (code: string) => Promise<string>;
	// RequestTokenByCredential: (code: string) => Promise<string>;
	RequestTokenStatus: (token: string) => Promise<Boolean>;
	GoLogin: () => void;
}
export interface IAuthorizationCodeFlow extends IAuthorizationBase  {
	RequestTokenByAuthcode: (code: string) => Promise<string>;
}
export interface IAuthorizationCredential extends IAuthorizationBase  {
	RequestTokenByCredential: () => Promise<string>;
}
export type OidcConfugiration = {
	baseUrl: string,
	tokenEndpoint: string,
	authEndpoint: string,
	userinfoEndpoint: string,
	client_id: string,
	client_secret: string,
	scope: string // ?
}