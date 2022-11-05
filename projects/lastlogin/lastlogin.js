(async function () {
	const username = (await (await fetch("https://scratch.mit.edu/session", {
		"headers": {
			"x-requested-with": "XMLHttpRequest"
		}
	})).json()).user.username
	if(location.pathname != `/users/${username}/`) {
		if(confirm("自分のプロフィールでもう一度実行してください\n 自動でプロフィールへ移動します よろしいですか？")) {
			location.href = `https://scratch.mit.edu/users/${username}/`
		}
	}
	if (!localStorage["lastlogin"]) {
		const lastlogin = {}
		if(confirm("置き換える対象は？\n 上の欄ならOK 下の欄ならキャンセルをおしてください")) {
			lastlogin["target"] = "bio"
		} else {
			lastlogin["target"] = "status"
		}
		lastlogin["data"] = prompt("置き換え用文字列を入力してください",`例:最終ログイン:%ALL\\nこの表示はJavaScriptで半自動更新しています`)
		window.localStorage["lastlogin"] = JSON.stringify(lastlogin)
	}
	const {data:vdata,target} = JSON.parse(localStorage["lastlogin"])
	const cookiedata = {};
document.cookie.split("; ").forEach(elem => {
	const arr = elem.split("=");
	cookiedata[arr[0]] = decodeURIComponent(arr[1]);
});
	const data  = vdata.replace(/%ALL/g, date.toLocaleString())
		.replace(/%YE/g, date.getFullYear())    // Yukkkuさんのコード丸パクリしてきました(ありがとうございます)
		.replace(/%MO/g, date.getMonth() + 1)
		.replace(/%DA/g, date.getDate())
		.replace(/%HO/g, date.getHours())
		.replace(/%MI/g, date.getMinutes())
		.replace(/%SE/g, date.getSeconds())
		.replace(/%MS/g, date.getMilliseconds())
		.replace(/%UALL/g, date.toString())
		.replace(/%UYE/g, date.getUTCFullYear())
		.replace(/%UMO/g, date.getUTCMonth() + 1)
		.replace(/%UDA/g, date.getUTCDate())
		.replace(/%UHO/g, date.getUTCHours())
		.replace(/%UMI/g, date.getUTCMinutes())
		.replace(/%USE/g, date.getUTCSeconds())
		.replace(/%UMS/g, date.getUTCMilliseconds())
		.replace(/%ISO/g, date.toISOString())

		fetch(`https://scratch.mit.edu/site-api/users/all/${username}/`, {
		"headers": {
			"x-csrftoken": cookiedata.scratchcsrftoken,
			"x-requested-with": "XMLHttpRequest"
		},
		"body": `{"${target}":"${data}"}`,
		"method": "PUT",
	});
})();