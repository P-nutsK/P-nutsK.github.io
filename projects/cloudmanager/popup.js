const handshakebtn = document.querySelector("#handshake");
const devlogbtn = document.querySelector("#switchlog");
const terget = document.querySelector("#terget");
const valueinput = document.querySelector("#valueinput");
const sendbtn = document.querySelector("#send");
const tbody = document.querySelector("tbody");
const cloudnames = [];
const clouddatas = [];
handshakebtn.onclick = function () {
	window.opener.postMessage({
		type: "handshake"
	}, "*")
}
devlogbtn.onclick = function () {
	window.opener.postMessage({
		type: "system_switchlog"
	}, "*");
}
sendbtn.onclick = function () {
	window.opener.postMessage({
		type: "send",
		terget: terget.value,
		value: valueinput.value
	}, "*");
}
/*
clearlogbtn.onclick = function () {
	result = confirm("ログを消去しますか？");
	if (result) logarea.innerHTML = "";
}
*/
window.addEventListener("message", (request) => {
	const data = request.data;
	data.forEach((message) => {
		if (!cloudnames.includes(message.name)) {
			cloudnames.push(message.name);
			// 表に追加
			const tr = document.createElement("tr");
			const title = document.createElement("th");
			title.className = "title";
			title.append(message.name);
			const htmldata = document.createElement("th");
			htmldata.className = "data";
			htmldata.onclick = function() {
				console.log(this);
				const copy = document.createElement("input");
				copy.value = this.textContent;
				document.body.append(copy);
				copy.select();
				console.log(this.textContent);
				console.log(copy);
				document.execCommand("copy");
				copy.remove();
				alert("値をコピーしました！");
			}
			tr.append(title,htmldata);
			tbody.append(tr);
			// 選択エリアに追加
			const option = document.createElement("option");
			option.append(message.name);
			terget.append(option);
		}
		clouddatas[cloudnames.indexOf(message.name)] = message.value;
		document.querySelectorAll("th.data")[cloudnames.indexOf(message.name)].textContent = message.value;
	});

})
//setInterval(() => {
//	if(!window.opener) {
//		window.close();
//	}
//},1000);
window.opener.onunload = function() {
	window.close();
}