const socket = new WebSocket("wss://clouddata.scratch.mit.edu/");
// WSからのメッセージを全てログ
console.enablelog = true;
socket.onmessage = function (event) {
	if (console.enablelog) {
		console.log(cloudgetJSON(event));
	}
	// WSからメッセージが来たらparseして送る
	window.thatWindow.postMessage(cloudgetJSON(event));
};
// 一応ソケットもログ
console.log(socket);

// 使うやつ
const username = document.querySelector("#navigation > div > ul > li.link.right.account-nav > div > a > span").textContent;
const projectId = location.pathname.replace(/[^0-9]/g, '');

// ポップアップ作成
window.thatWindow = window.open(
	"",
	"_blank",
	"menubar=0,width=675,height=300,top=100,left=100"
);

// htmlを形成
window.thatWindow.document.head.append(createElement("link", { // 関数型言語みたいになってて草
	href: "https://p-nutsk.github.io/projects/cloudmanager/popup.css",
	rel: "stylesheet"
}));
// その他
window.thatWindow.document.body.append(...createElements());

// popupからメッセージが来たら
window.addEventListener("message", (request) => {
	// 抽出
	const message = request.data;
	console.log(request);
	if (message.type === "handshake") {
		// なんか起きた時用
		if (socket.OPEN) {
			socket.send(`${JSON.stringify({
				method: "handshake",
				project_id: projectId,
				user: username
			})}\n`);
			console.log("handshake");
			window.thatWindow.document.querySelector("#send").removeAttribute("disabled");
		} else {
			throw TypeError("socket is Not Opened");
		}
	}
	if (message.type === "send") {
		socket.send(`${JSON.stringify({
			method: "set",
			project_id: projectId,
			user: username,
			name: message.terget,
			value: message.value
		})}\n`);
		// 自分が変更した趣旨を送る
		window.thatWindow.postMessage([{
			method: "set",
			project_id: projectId,
			user: username,
			name: message.terget,
			value: message.value
		}]);
		console.log("ws Send");
	}
	if (message.type === "system_switchlog") {
		if (console.enablelog) {
			console.enablelog = false;
			console.log("サーバーからのメッセージを表示しないようにしました");
		} else {
			console.enablelog = true;
			console.log("メッセージ表示を再開しました");
		}
	}
});



function createElements() {
	// タイトル
	const h1 = createElement("h1");
	h1.append("☁ CloudManager");
	// 親画面のタイトル
	const projectTitle = createElement("span", "projectTitle");
	fetch(`https://api.scratch.mit.edu/projects/${projectId}`)
		.then(res => res.json())
		.then(json => json.title)
		.then(title => projectTitle.append(title)); // async使うのめんどくなった
	const br1 = createElement("br");
	// handshakeボタン
	const handshake = createElement("button", "handshake");
	handshake.append("handshake");
	// log出力切り替え
	const switchlog = createElement("button", "switchlog");
	switchlog.append("ログ出力");
	// 改行
	const br2 = createElement("br");
	// 変更ターゲット
	const terget = createElement("select", "terget");
	// 変更ターゲットの値
	const valueinput = createElement("input", {
		id: "valueinput",
		type: "number",
		placeholder: "±256桁までの数"
	});
	// 送信
	const send = createElement("button", "send");
	send.append("send");
	/*
	// ログエリア
	const logarea = document.createElement("div");
	logarea.id = "logarea";
	logarea.style = "height: 800px; border: 1px solid #000; overflow-y: scroll;"
	// 変更ターゲット
	const clearlog = document.createElement("button");
	clearlog.id = "clearlog";
	clearlog.append("ログクリア");
	*/
	// 変数表
	const table = createElement("table");
	const thead = createElement("thead");
	const tr = createElement("tr");
	const titleth = createElement("th", {
		colSpan: "1"
	});
	titleth.append("変数名");
	const datath = createElement("th", {
		colSpan: "1"
	});
	datath.append("値");
	tr.append(titleth, datath);
	thead.append(tr);
	const tbody = createElement("tbody", "cloudtable");
	table.append(thead, tbody);
	// script
	const script = createElement("script", { src: "https://p-nutsk.github.io/projects/cloudmanager/popup.js" });
	return [ h1, projectTitle, br1, handshake, switchlog, br2, terget, valueinput, send, table, script ];
}

function cloudgetJSON(event) {
	const data = event.data.split("\n").slice(0, -1);
	data.forEach((element, index) => {
		data[index] = JSON.parse(element);
	});
	return data;
}
function createElement(name, data) {
	console.log("name:", name, "data", data);
	const elm = document.createElement(name);
	if (data != undefined) {
		if (typeof data === 'string') {
			elm.id = data;
		} else {
			Object.keys(data).forEach(key => {
				elm[key] = data[key];
			});
		}
	}
	console.log(elm);
	return elm;
}