/*
* Dark mode toggle
*
* In its current state, it will cause a FOIT.
* Based on Internet research, the only way to
* prevent this is to have a server-side language
* insert the dark-theme class before it begins to
* render.
*/

var prefersDarkTheme = localStorage.getItem('darkTheme');

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

var darkThemeButton = document.getElementById('dark-theme-toggle');
darkThemeButton.innerText = prefersDarkTheme ? 'Click for Light Theme' : 'Click for Dark Theme';

/*
* Function that toggles light and dark mode
* Doesn't use jQuery, probably could with some modification
*/
function toggleTheme() {
	prefersDarkTheme = !prefersDarkTheme;

	// Toggle for all elements
	var elements = document.getElementsByTagName('*');
	for (var index = 0; index < elements.length; index++) {
		var element = elements[index];
		element.classList.toggle('dark-theme');
	}

	localStorage.setItem('darkTheme', prefersDarkTheme);
	darkThemeButton.innerText = prefersDarkTheme ? 'Click for Light Theme' : 'Click for Dark Theme';
}

darkThemeButton.addEventListener('click', function () {
	// Idk why this can't be directly called, but oh well
	toggleTheme();
});

// Loads dark mode if user prefers it from beginning
if (prefersDarkTheme) {
	prefersDarkTheme = false;
	toggleTheme();
}
