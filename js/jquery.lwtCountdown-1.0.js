/*!
 * jQuery Countdown plugin v1.0
 * http://www.littlewebthings.com/projects/countdown/
 *
 * Copyright 2010, Vassilis Dourdounis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function($){

	$.fn.countDown = function (options) {
		var element = $(this), targetTime = new Date();
	
		if (options.targetDate)
		{
			targetTime = new Date(
				options.targetDate.month + '/' + options.targetDate.day + '/' + options.targetDate.year + ' ' +
				options.targetDate.hour + ':' + options.targetDate.min + ':' + options.targetDate.sec +
				(options.targetDate.utc ? ' UTC' : '')
			);
		}
		else if (options.targetOffset)
		{
			targetTime.setFullYear(options.targetOffset.year + targetTime.getFullYear());
			targetTime.setMonth(options.targetOffset.month   + targetTime.getMonth());
			targetTime.setDate(options.targetOffset.day      + targetTime.getDate());
			targetTime.setHours(options.targetOffset.hour    + targetTime.getHours());
			targetTime.setMinutes(options.targetOffset.min   + targetTime.getMinutes());
			targetTime.setSeconds(options.targetOffset.sec   + targetTime.getSeconds());
		}

		element.data('targetTime', targetTime);
		element.data('callback',   options.onComplete);
		element.data('omitWeeks',  options.omitWeeks);

		element.find('.digit').html('<div class="top"></div><div class="bottom"></div>');
		element.startCountDown();

		return this;
	};

	$.fn.stopCountDown = function () {
		clearTimeout(this.data('timer'));
	};

	$.fn.startCountDown = function () {
		var diffSecs = Math.floor((+this.data('targetTime') - +new Date())/1000);
		this.doCountDown(diffSecs, 500);
	};

	$.fn.doCountDown = function (diffSecs, duration) {
		if (diffSecs <= 0) {
			this.stopCountDown();
			var onComplete = this.data('callback');
			if (onComplete) onComplete.apply(this);
			return;
		}

		secs = diffSecs % 60;
		mins = Math.floor(diffSecs/60)%60;
		hours = Math.floor(diffSecs/60/60)%24;
		if (this.data('omitWeeks') == true)
		{
			days = Math.floor(diffSecs/60/60/24);
			weeks = Math.floor(diffSecs/60/60/24/7);
		}
		else 
		{
			days = Math.floor(diffSecs/60/60/24)%7;
			weeks = Math.floor(diffSecs/60/60/24/7);
		}

		this.dashChangeTo('.seconds_dash', secs,  duration || 800);
		this.dashChangeTo('.minutes_dash', mins,  duration || 1200);
		this.dashChangeTo('.hours_dash',   hours, duration || 1200);
		this.dashChangeTo('.days_dash',    days,  duration || 1200);
		this.dashChangeTo('.weeks_dash',   weeks, duration || 1200);

		var self = this;
		this.data('timer', setTimeout(function() { self.doCountDown(diffSecs - 1) } , 1000));
	};

	$.fn.dashChangeTo = function (selector, n, duration) {
		this.find (selector + ' .digit').each (function (i) {
			// The first digit is i=0, the second i=1
			$(this).digitChangeTo(i == 0 ? Math.floor(n/10) : n%10, duration);
		})
	};

	$.fn.digitChangeTo = function (n, duration) {
		if (!duration)
			duration = 800;

		var top = this.find('.top'),
				bot = this.find('.bottom');

		if (top.html() != n + '')
		{
			top.html(n || '0').slideDown(duration);

			bot.animate({height: 0}, duration, function() {
				bot.html(n || '0').css({height: '100%'});
				top.hide();
			});
		}
	};

})(jQuery);
