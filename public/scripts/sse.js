const eventSource = new EventSource('/sse/4');

eventSource.onmessage = (event) => {
	const { data } = event;
	if (!data) return;
	const element = document.createElement('li');
	const parseData = JSON.parse(data);
	element.innerHTML = `+ id: ${parseData.id} </br>
                       + userId : ${parseData.userId} </br>
                       + message: ${parseData.message} </br> 
                       + timestamp : ${parseData.timestamp} </br> 
                      `;
	document.body.appendChild(element);
};
