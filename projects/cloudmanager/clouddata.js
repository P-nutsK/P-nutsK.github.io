const socket = new WebSocket("wss://clouddata.scratch.mit.edu/");
// クラウドメッセージを全てログ
console.enablelog = true;
socket.onmessage = function (event) {
	if (console.enablelog) {
		console.log(cloudgetJSON(event));
	}
	window.thatWindow.postMessage(cloudgetJSON(event));
};

console.log(socket);

setTimeout(() => {
	window.username = document.querySelector("#navigation > div > ul > li.link.right.account-nav > div > a > span").textContent;
	window.projectId = location.pathname.replace(/[^0-9]/g, '');

}, 1000);


window.thatWindow = window.open(
	"",
	"_blank",
	"menubar=0,width=675,height=300,top=100,left=100"
);
// htmlを形成
const { h1, Pname, br1, handshake, switchlog, br2, terget, valueinput, send, table, script, csslink } = createElements();
window.thatWindow.document.head.append(csslink);
window.thatWindow.document.body.append(h1, Pname, br1, handshake, switchlog, br2, terget, valueinput, send, table, script);
// popupからメッセージが来たら
window.addEventListener("message", (request) => {
	const message = request.data;
	console.log(request);
	if (message.type === "handshake") {
		if (socket.OPEN) {
			socket.send(`${JSON.stringify({
				method: "handshake",
				project_id: window.projectId,
				user: window.username
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
			project_id: window.projectId,
			user: window.username,
			name: message.terget,
			value: message.value
		})}\n`);
		window.thatWindow.postMessage({
			method: "set",
			project_id: window.projectId,
			user: window.username,
			name: message.terget,
			value: message.value
		});
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
	const Pname = createElement("a", {
		id: "Pname",
		href: location.href,
		terget: "_parent"
	});
	setTimeout(() => {
		const projectName = document.querySelector("#view > div > div.inner > div.flex-row.preview-row.force-row > div.flex-row.project-header > div > div").textContent;
		Pname.append(projectName);
	}, 1000);
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
	// Script
	const script = createElement("script", { src: "https://p-nutsk.github.io/projects/cloudmanager/popup.js" });
	// CSSlink
	const csslink = createElement("link", {
		href: "https://p-nutsk.github.io/projects/cloudmanager/popup.css",
		rel: "stylesheet"
	});
	return { h1, Pname, br1, handshake, switchlog, br2, terget, valueinput, send, table, script, csslink };
}

function cloudgetJSON(event) {
	const data = event.data.split("\n").slice(0, -1);
	data.forEach((element, index) => {
		data[index] = JSON.parse(element);
	});
	return data;
}
function createElement(name, data) {
	console.log("name:",name,"data",data);
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