/* global jQuery */

jQuery(function($, undefined) {
	'use strict';
	
	var words = window.words;
	var MAX_RESULTS = 100;
	var ALTS = [
		{
			re: /ي/g,
			rpl: 'ی'
		},
		{
			re: /ك/g,
			rpl: 'ک'
		},
		{
			re: /آ|إ|أ/g,
			rpl: 'ا'
		},
		{
			re: /ؤ/g,
			rpl: 'و'
		},
		{
			re: /ئ/g,
			rpl: 'ی'
		},
		{
			re: /ة/g,
			rpl: 'ه'
		},
		{
			re: /﷼/g,
			rpl: 'ریال'
		},
	];
	
	var app = {

		convertArabicCharsToPersian: function(str) {
			ALTS.forEach(function(alt) {
				str = str.replace(alt.re, alt.rpl);
			});
			return str;
		},

		removeAllSpaces(str) {
			return str.replace(/\s/, '');
		},

		getChars: function() {
			var charsStr = app.$chars.val().trim();
			charsStr = app.removeAllSpaces(charsStr);
			charsStr = app.convertArabicCharsToPersian(charsStr);
			return charsStr.split('');
		},

		li: function(text) {
			return '<li>' + text + '</li>';
		},

		showResults: function(results) {
			if (!results || !results.length) {
				app.$nothing.show();
				app.$results.html('');
				return;
			}
			app.$nothing.hide();
			
			var listItems = results.reduce(function(accu, word) {
				return accu + app.li(word);
			}, '');
			app.$results.html(listItems);
		},

		matches: function(chars, word) {
			chars = chars.slice(0);
			for (var i = 0, len = word.length, idx; i < len; i++) {
				idx = chars.indexOf(word.charAt(i));
				if (idx === -1) {
					return false;
				}
				chars[idx] = undefined;
			}
			return true;
		},

		findMatches: function(chars) {
			var results = [];
			for (var i = 0, len = words.length, word; i < len; i++) {
				word = words[i];
				if (!app.matches(chars, word)) {
					continue;
				}
				results.push(word);
				if (results.length === MAX_RESULTS) {
					return results;
				}
			}
			return results;
		},

		onFind: function(e) {
			e.preventDefault();
			var chars = app.getChars();

			if (!chars.length) {
				app.showResults([]);
				return;
			}

			console.log(chars);
			
			var results = app.findMatches(chars);
			app.showResults(results);
		},

		main: function() {
			app.$searchForm = $('#search-form');
			app.$chars = $('#chars');
			app.$findBtn = $('#find');
			app.$nothing = $('.nothing');
			app.$results = $('#results');
			app.$searchForm.submit(app.onFind);
		},
		
	};

	app.main();
});
