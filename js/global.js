/* removeHover, MIT license, https://github.com/kof/remove-hover */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.removeHover=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){"use strict";var hoverRegex=/:hover/;module.exports=function(){var sheets=document.styleSheets,sheetIndex,ruleIndex,selIndex,sheet,rule,rulsLn,selectors,selectorText;if(!("ontouchend"in document)||!sheets||!sheets.length)return;for(sheetIndex=0;sheetIndex<sheets.length;++sheetIndex){sheet=sheets[sheetIndex];if(!sheet.cssRules)continue;rulsLn=sheet.cssRules.length;for(ruleIndex=0;ruleIndex<rulsLn;++ruleIndex){rule=sheet.cssRules[ruleIndex];if(rule&&rule.selectorText&&hoverRegex.test(rule.selectorText)){selectors=rule.selectorText.split(",");selectorText="";for(selIndex=0;selIndex<selectors.length;++selIndex){if(!hoverRegex.test(selectors[selIndex])){if(selectorText)selectorText+=",";selectorText+=selectors[selIndex]}}if(selectorText){rule.selectorText=selectorText}else{sheet.deleteRule(ruleIndex)}}}}}},{}]},{},[1])(1)});

/*! Copyright 2014 | GPL v.2 | Bob Wadholm, rwadholm@indiana.edu
http://www.bob.wadholm.com/licenses.shtml */
$(function(){
	var site = $('body').attr('id');
	removeHover();
	$.getJSON('/json/'+ site +'.json',function(data){
		var currentPage = '#front',
		results = {'q1':false,'q2':false,'q3':false,'q4':false,'q5':false,'q6':false,'q7':false,'q8':false,'q9':false};
		
		$('body').on('click','#front a.button',function(e){
			e.preventDefault();
			$(this).parent().toggle();
			$('#startOver').fadeIn();
			$('header a').fadeIn();
			$('#Q1').fadeIn();
		});
		
		$('body').on('click','#startOver a, header a', function(e){
			e.preventDefault();
			results = {'q1':false,'q2':false,'q3':false,'q4':false,'q5':false,'q6':false,'q7':false,'q8':false,'q9':false};
			$('#front').fadeIn();
			$('#questions div').hide();
			$('#startOver').hide();
			$('#results').hide();
			$('header a').hide();
		});	
		
		$('body').on('click','#questions a', function(e){
			e.preventDefault();
			thisQ = $(this).attr('id');
			correct = $(this).attr('class');
			link = $(this).attr('href');
			
			if(correct === 'correct'){
				results[thisQ] = true;
			}
			
			if(link === '#results'){
				var i = 0;
				for (var prop in results) {
					$('.'+ prop).removeClass('qfalse qtrue').addClass('q'+ results[prop]);
					if(results[prop]){
						i++;
					}
				}
				
				console.log(results);
				
				$('.bad').removeClass('bad');
				
				i = (9 - i);
				if(i>=5){
					exp = data.explanation[2] + data.explanation[3];
					$('#explanation').addClass('bad');
				} else if (i>=3){
					exp = data.explanation[1];
				} else {
					exp = data.explanation[0];
				}
				$('#explanation').html('<strong>'+ i +' Incorrect:</strong> '+ exp);
				$(this).parent().parent().toggle();
				$(link).fadeIn(function(){
					if(!$('#moreInfo').is(':visible')) {
						$('aside').hide();	
					}
					if(!$('#moreInfo').is(':visible') && !$('aside').is(':visible')) {
						$('aside').show();	
					}
				});
			} else {
				$(this).parent().parent().toggle();
				$(link).fadeIn();
			}
		});
		
		$('body').on('click','#moreInfo', function(){
			$('aside').fadeToggle(100);	
		});
		
		$('body').on('click','#create', function(e){
			e.preventDefault();
			$.post( "create.php", $("form").serialize(), function(data){
				$('#createMessage').remove();
				$('#front p').prepend('<span id="createMessage">'+ data +'</span>');	
			});
		});
	});
});