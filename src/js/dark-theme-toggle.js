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
var prefersDarkTheme = localStorage.getItem('darkTheme') || '';
var darkThemeButton = document.getElementById('dark-theme-toggle');
darkThemeButton.value = prefersDarkTheme;
updateTheme();

function updateTheme() {
	var isDark = prefersDarkTheme ? prefersDarkTheme === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;

	var darkStyles = document.getElementById('dark-theme-styles');
	darkStyles.disabled = !isDark;
}

/*
* Function that toggles light and dark mode
* Doesn't use jQuery, probably could with some modification
*/
function toggleTheme() {
	prefersDarkTheme = document.getElementById('dark-theme-toggle').value;
	updateTheme();

	localStorage.setItem('darkTheme', prefersDarkTheme);
}

darkThemeButton.addEventListener('change', toggleTheme);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
