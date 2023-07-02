document.getElementById('form-submit').addEventListener('submit', (e) => {
	e.preventDefault();
	const company = document.querySelector('#company-input').value;
	const userId = document.querySelector('#user-id-input').value;
	const eventSource = new EventSource(`/${company}/${userId}`);

	eventSource.onmessage = ({ data }) => {
		const parseData = JSON.parse(data);
		const li = document.createElement('li');
		li.innerHTML = `
      <p>[${parseData.company}] ${parseData.userId} </p>
      <p>${data}</p>
      <p>-------------------------------</p>
    `;
		document.body.appendChild(li);
		eventSource.close();
	};
});
