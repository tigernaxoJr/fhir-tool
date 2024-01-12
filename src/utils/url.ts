/**
 * 移除網址的某個參數
 */
export function RemoveParameter(url: string, parameter: string): string
{
	const _url = new URL(url);
	const queryParams = new URLSearchParams(_url.search);
	// todo: remove parameter from params as new object
	queryParams.delete(parameter)
	_url.search = queryParams.toString()
	return _url.toString()
}
export default { RemoveParameter }