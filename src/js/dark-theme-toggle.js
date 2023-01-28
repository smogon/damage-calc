/*
* Dark mode toggle
*
* In its current state, it will cause a FOIT.
* Based on Internet research, the only way to
* prevent this is to have a server-side language
* insert the dark-theme class before it begins to
* render.
*/

let prefersDarkTheme = localStorage.getItem('darkTheme');

/*
* localStorage will only store strings
* This means that if it has the value 'false',
* It will be truey and incorrectly cause the
* dark theme to load.
*/
if (prefersDarkTheme == 'true') {
	prefersDarkTheme = true;
} else {
	prefersDarkTheme = false;
}

const darkThemeButton = document.getElementById('dark-theme-toggle');
darkThemeButton.innerText =
		`Click for ${prefersDarkTheme ? 'Light' : 'Dark'} Theme!`

/*
* Function that toggles light and dark mode
* Doesn't use jQuery, probably could with some modification
*/
function toggleTheme() {
	prefersDarkTheme = !prefersDarkTheme

	// Toggle for all elements
	const elements = document.getElementsByTagName('*')
	for (let element of elements) {
		element.classList.toggle('dark-theme')
	}

	localStorage.setItem('darkTheme', prefersDarkTheme)
	darkThemeButton.innerText =
		`Click for ${prefersDarkTheme ? 'Light' : 'Dark'} Theme!`
}

darkThemeButton.addEventListener('click', () => {
	// Idk why this can't be directly called, but oh well
	toggleTheme()
})

// Loads dark mode if user prefers it from beginning
if (prefersDarkTheme) {
	prefersDarkTheme = false
	toggleTheme();
}
