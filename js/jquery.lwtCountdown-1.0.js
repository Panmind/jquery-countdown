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
		var element  = $(this);
		var diffSecs = element.setCountDown(options);
	
		element.data('callback', options.onComplete);
		element.data('omitWeeks', options.omitWeeks);

		element.find('.digit').html('<div class="top"></div><div class="bottom"></div>');
		element.doCountDown(diffSecs, 500);

		return this;
	};

	$.fn.stopCountDown = function () {
		clearTimeout(this.data('timer'));
	};

	$.fn.startCountDown = function () {
		this.doCountDown(this.data('diffSecs'), 500);
	};

	$.fn.setCountDown = function (options) {
		var targetTime = new Date();

		if (options.targetDate)
		{
			targetTime = new Date(options.targetDate.month + '/' + options.targetDate.day + '/' + options.targetDate.year + ' ' + options.targetDate.hour + ':' + options.targetDate.min + ':' + options.targetDate.sec + (options.targetDate.utc ? ' UTC' : ''));
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

		var nowTime = new Date();

		diffSecs = Math.floor((targetTime.valueOf()-nowTime.valueOf())/1000);

		this.data('diffSecs', diffSecs);

		return diffSecs;
	};

	$.fn.doCountDown = function (diffSecs, duration) {
		if (diffSecs <= 0)
		{
			diffSecs = 0;
			if (t = this.data('timer'))
			{
				clearTimeout(t);
			}
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

		this.data('diffSecs', diffSecs);
		if (diffSecs > 0)
		{
			e = this;
			t = setTimeout(function() { e.doCountDown(diffSecs - 1) } , 1000);
			this.data('timer', t);
		} 
		else if (cb = this.data('callback'))
		{
			cb();
		}

	};

	$.fn.dashChangeTo = function (selector, n, duration) {
		  for (var i = (this.find(selector + ' .digit').length-1); i>=0; i--)
		  {
				var d = n % 10;
				n = (n - d) / 10;
				this.digitChangeTo('#' + this.attr('id') + ' ' + selector + ' .digit:eq('+i+')', d, duration);
		  }
	};

	$.fn.digitChangeTo = function (digit, n, duration) {
		if (!duration)
		{
			duration = 800;
		}
		if ($(digit + ' div.top').html() != n + '')
		{

			$(digit + ' div.top').css({'display': 'none'});
			$(digit + ' div.top').html((n ? n : '0')).slideDown(duration);

			$(digit + ' div.bottom').animate({'height': ''}, duration, function() {
				$(digit + ' div.bottom').html($(digit + ' div.top').html());
				$(digit + ' div.bottom').css({'display': 'block', 'height': ''});
				$(digit + ' div.top').hide().slideUp(10);

			
			});
		}
	};

})(jQuery);


