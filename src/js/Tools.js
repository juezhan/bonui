$(window).bind('popstate', function () {
	if (window.confirm('亲，评价还未完成，您确定要离开么？')) {
		window.history.back();
	} else {
		winSetState();
	}
});

function winSetState() {
	if (window.history.state == 'satisfice') {
		window.history.replaceState('satisfice', null, location.href);
	} else {
		window.history.pushState('satisfice', null, location.href);
	}
}

winSetState();