/*
* Dark mode toggle
*
* In its current state, it will cause a minor FOIT.
* Basically, the background behind the panels will
* briefly flash white before turning dark. It's
* better than before, but not perfect.
*/

/*
* localStorage will only store strings
* This means that if it has the value 'false',
* It will be truey and incorrectly cause the
* dark theme to load.
*/
if (!localStorage.getItem('darkTheme')) {
	localStorage.setItem('darkTheme', window.matchMedia('(prefers-color-scheme: dark)').matches);
}
var prefersDarkTheme = localStorage.getItem('darkTheme') === 'true';
var darkThemeButton = document.getElementById('dark-theme-toggle');
darkThemeButton.innerText = prefersDarkTheme ? 'Click for Light Theme' : 'Click for Dark Theme';
if (prefersDarkTheme) {
	var darkStyles = document.getElementById('dark-theme-styles');
	if (darkStyles.disabled) {
		darkStyles.disabled = !darkStyles.disabled;
	}
}

/*
* Function that toggles light and dark mode
* Doesn't use jQuery, probably could with some modification
*/
function toggleTheme() {
	prefersDarkTheme = !prefersDarkTheme;

	var darkStyles = document.getElementById('dark-theme-styles');
	darkStyles.disabled = !darkStyles.disabled;

	localStorage.setItem('darkTheme', prefersDarkTheme);
	darkThemeButton.innerText = prefersDarkTheme ? 'Click for Light Theme' : 'Click for Dark Theme';
}

darkThemeButton.addEventListener('click', toggleTheme);
